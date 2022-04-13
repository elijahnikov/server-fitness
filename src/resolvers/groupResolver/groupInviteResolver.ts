import { Group } from "../../entities/groupEntity";
import { GroupInvites } from "../../entities/groupInvitesEntity";
import { GroupMembers } from "../../entities/groupMembersEntity";
import { User } from "../../entities/userEntity";
import { _Context } from "../../types";
import { checkAuth } from "../../utils/checkAuth";
import { Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";

@ObjectType()
class GetInvites {
    @Field(() => [GroupInvites])
    invites: GroupInvites[]
}

@Resolver(GroupInvites)
export class GroupInvitesResolver
{

    @FieldResolver(() => Group)
    group(
        @Root() groupInvites: GroupInvites,
        @Ctx() {groupLoader}: _Context
    ){
        return groupLoader.load(groupInvites.groupId)
    }

    @Mutation(() => GroupInvites, {nullable: true})
    @UseMiddleware(checkAuth)
    async createInvite(
        @Arg("username") username: string,
        @Ctx() {req}: _Context
    ): Promise<GroupInvites | null>
    {
        if (!req.session.userId) return null

        const group = await Group.findOne({creatorId: req.session.userId})

        //check if user exists by username
        const userToInvite = await User.findOne({username: username})
        if (!userToInvite) {
            return null
        }

        const getInvites = await GroupInvites.findOne({userMemberId: userToInvite.id, groupId: group?.id})
        if (getInvites) return null

        //check if user currently in group
        const checkIfUserInGroup =  await GroupMembers.findOne({userMemberId: userToInvite.id})
        if (checkIfUserInGroup) {
            return null
        }

        return GroupInvites.create({
            groupId: group?.id,
            userMemberId: userToInvite.id
        }).save()

    }

    @Query(() => GetInvites)
    async getInvites(
        @Ctx() {req}: _Context
    ): Promise<GetInvites>
    {   
        const {userId} = req.session

        const results = await getConnection().query(`
            select gi.*
            from group_invites gi
            where gi."userMemberId" = $1
            order by gi."createdAt" DESC 
        `, [userId])

        return {invites: results}
    }

    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async acceptResponse(
        @Ctx() {req}: _Context
    ) : Promise<boolean>
    {
        const getInvites = await GroupInvites.findOne({userMemberId: req.session.userId})
        if (!getInvites) return false
        
        await GroupMembers.create({
            groupId: getInvites.groupId,
            userMemberId: req.session.userId
        }).save()

        await GroupInvites.delete({userMemberId: req.session.userId})
        return true
    }

    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async declineResponse(
        @Ctx() {req}: _Context
    ) : Promise<boolean>
    {
        const getInvites = await GroupInvites.findOne({userMemberId: req.session.userId})
        if (!getInvites) return false

        await GroupInvites.delete({userMemberId: req.session.userId})
        return true
    }

}