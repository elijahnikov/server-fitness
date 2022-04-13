import { _Context } from "../types";
import { MiddlewareFn } from "type-graphql";
import { GroupMembers } from "../entities/groupMembersEntity";

//check if user is logged in
export const checkAuth: MiddlewareFn<_Context> = ({context}, next) => 
{
    if (!context.req.session.userId) throw new Error("Not authenticated. Please sign in.")
    return next()
}

//check if user is owner of group
export const checkOwner: MiddlewareFn<_Context> = async ({context}, next) =>
{
    const check = await GroupMembers.findOne({userMemberId: context.req.session.userId})
    if (!check?.isOwner) throw new Error("You are not the owner.")
    return next()
}