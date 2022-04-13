import { Group } from "../../entities/groupEntity";
import { _Context } from "../../types";
import { checkAuth, checkOwner } from "../../utils/checkAuth";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { GroupMembers } from "../../entities/groupMembersEntity";
import { getConnection } from "typeorm";
import { User } from "../../entities/userEntity";

@ObjectType()
class GroupError 
{
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class GroupResponse 
{
    @Field(() => [GroupError], {nullable: true})
    errors?: GroupError[];

    @Field(() => Group, {nullable: true})
    group?: Group;
}


@Resolver(Group)
export class GroupResolver
{

    @Mutation(() => GroupResponse)
    @UseMiddleware(checkAuth)
    async createGroup(
        @Arg("name") name: string,
        @Ctx() {req}: _Context
    ): Promise<GroupResponse>
    {

        if (!name)
        {
            return {
                errors: [
                    {
                        field: 'name',
                        message: 'You have not entered a name.'
                    }
                ]
            }
        }

        //check if user is owner or part of another group
        const checkGroup = await GroupMembers.findOne({userMemberId: req.session.userId})
        if (checkGroup) 
        {
            return {
                errors: [
                    {
                        field: "name",
                        message: "You are already part of / own a group"
                    }
                ]
            }
        }

        const group = await Group.create({
            name: name,
            creatorId: req.session.userId
        }).save()

        await getConnection().transaction(async (tm) => {
            await tm.query(`
                insert into group_members ("groupId", "userMemberId", "isOwner")
                values ($1, $2, $3)
            `, [group.id, req.session.userId, true])
        })

        return {
            group
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    @UseMiddleware(checkOwner)
    async deleteGroup(
        @Arg("id", () => Int) id: number,
    ): Promise<boolean>
    {
        await Group.delete({id})
        return true;
    }

    
    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    @UseMiddleware(checkOwner)
    async kickMember(
        @Arg("id", () => Int) id: number, 
        @Ctx() {req}: _Context,
    ): Promise<Boolean>
    {

        //double check if user is owner
        const {userId} = req.session
        const checkIfOwner = await GroupMembers.findOne({userMemberId: userId})
        if (!checkIfOwner?.isOwner) return false

        //if user exists, limits any possible bugs
        const userToKick = await User.findOne({id: id})
        if (!userToKick) return false

        await GroupMembers.delete({userMemberId: userToKick.id})
        return true

    }

    @Query(() => Boolean)
    @UseMiddleware(checkAuth)
    async checkIfOwner(
        @Ctx() {req}: _Context
    ): Promise<boolean>
    {
        const {userId} = req.session
        const checkIfOwner = await GroupMembers.findOne({userMemberId: userId})
        if (checkIfOwner?.isOwner) return true

        return false
    }

    @Query(() => Group)
    @UseMiddleware(checkAuth)
    async getGroupByUser(
        @Ctx() {req}: _Context
    ): Promise<Group | undefined>
    {
        const {userId} = req.session

        const groupMember = await GroupMembers.findOne({userMemberId: userId})
        const group = await Group.findOne({id: groupMember?.groupId})

        return group
    }

    @Query(() => Boolean)
    @UseMiddleware(checkAuth)
    async checkIfInGroup(
        @Ctx() {req}: _Context
    ): Promise<boolean>
    {
        const {userId} = req.session

        const groupMember = await GroupMembers.findOne({userMemberId: userId})

        if (groupMember) return true
        else return false

    }
}