import { GroupMembers } from "../../entities/groupMembersEntity";
import { checkAuth } from "../../utils/checkAuth";
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { _Context } from "../../types";
import { getConnection } from "typeorm";
import { User } from "../../entities/userEntity";

@ObjectType()
class GetMembers {
    @Field(() => [GroupMembers])
    members: GroupMembers[]
}

@Resolver(GroupMembers)
export class GroupMembersResolver
{

    @FieldResolver(() => User)
    user(
        @Root() groupMembers: GroupMembers,
        @Ctx() {userLoader}: _Context
    ){
        return userLoader.load(groupMembers.userMemberId)
    }

    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async leaveGroup(
        @Ctx() {req}: _Context
    ): Promise<boolean>
    {

        if (!req.session.userId) return false

        //check if user is in group
        const groupMem = await GroupMembers.findOne({userMemberId: req.session.userId})
        if (!groupMem) return false
        
        //if member is owner and leaves, delete group
        if (groupMem.isOwner)
        {
            
            //sql query to make earliest member not owner, new owner when original owner leaves
            await getConnection().transaction(async (tm) => {
                await tm.query(`                    
                    with cte as (
                        select *
                        from group_members
                        where "isOwner"  = false 
                        order by "createdAt" fetch first 1 row only
                    )
                    update group_members gm
                    set "isOwner" = true
                    from cte
                    where gm."userMemberId" = cte."userMemberId"
                `)
            })

            await GroupMembers.delete({userMemberId: groupMem.userMemberId})
            
        }
        else 
        {
            await GroupMembers.delete({userMemberId: req.session.userId})
        }

        return true
    }

    @Query(() => GetMembers)
    @UseMiddleware(checkAuth)
    async getGroupMembers(
        @Arg('id', () => Int) id: number,
    ): Promise<GetMembers | undefined>
    {
        const members = await getConnection().query(`
            select gm.*
            from group_members gm
            where gm."groupId" = $1
            order by gm."isOwner" DESC
        `, [id])
        // const members = await GroupMembers.find({where: {id: id}})
        return {members: members}
    }

}