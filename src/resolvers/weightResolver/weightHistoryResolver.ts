import { WeightHistory } from "../../entities/weightHistoryEntity";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { _Context } from "../../types";
import { getConnection } from "typeorm";
import { checkAuth } from "../../utils/checkAuth";
import { GroupMembers } from "../../entities/groupMembersEntity";
import { GroupActivity } from "../../entities/groupActivityEntity";

@ObjectType()
class GetWeightHistory
{
    @Field(() => [WeightHistory])
    weightHistory: WeightHistory[]
}

@Resolver(WeightHistory)
export class WeightHistoryResolver
{
    //create new weight history
    @Mutation(() => WeightHistory)
    @UseMiddleware(checkAuth)
    async createWeightEntry(
        @Arg("weight") weight: number,
        @Ctx() {req}: _Context
    ): Promise<WeightHistory | null>
    {
        if (!req.session.userId) return null

        const groupCheck = await GroupMembers.findOne({userMemberId: req.session.userId})

        const results = getConnection()
            .getRepository(WeightHistory)
            .createQueryBuilder('wh')
            .orderBy('wh."createdAt"', "DESC")
            .take(1)
            .where('wh."userId" = :id', {id: req.session.userId})

        const recentWeight = await results.getOne()
        console.log(recentWeight)

        const newEntry = await WeightHistory.create({
            weight: weight,
            previousWeight: recentWeight?.weight,
            userId: req.session.userId
        }).save()

        if (groupCheck)
        {
            await GroupActivity.create({
                groupId: groupCheck.groupId,
                weightHistoryId: newEntry.id,
                userId: req.session.userId
            }).save()
        }

        return newEntry
    }

    @Query(() => GetWeightHistory)
    async getWeightHistoryByUser(
        @Ctx() {req}: _Context
    ): Promise<GetWeightHistory | undefined>
    {
        const {userId} = req.session

        const results = getConnection()
            .getRepository(WeightHistory)
            .createQueryBuilder("hist")
            .take()
            .where("hist.userId = :id", {id: userId})

        const history = await results.getMany()

        return { weightHistory: history }
    }
}