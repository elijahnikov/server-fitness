import { GroupActivity } from "../../entities/groupActivityEntity";
import { Arg, Ctx, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from "type-graphql";
import { _Context } from "src/types";
import { getConnection } from "typeorm";
import { GroupMembers } from "../../entities/groupMembersEntity";
import { WorkoutDiary } from "../../entities/workoutDiaryEntity";
import { FoodDiary } from "../../entities/foodDiaryEntity";
import { WeightHistory } from "../../entities/weightHistoryEntity";
import { User } from "../../entities/userEntity";

@ObjectType()
class PaginatedActivity {
    @Field(() => [GroupActivity])
    activities: GroupActivity[]

    @Field()
    hasMore: boolean;
}

@Resolver(GroupActivity)
export class GroupActivityResolver
{

    @FieldResolver(() => WorkoutDiary, {nullable: true})
    workoutDiary(
        @Root() groupActivity: GroupActivity,
        @Ctx() {workoutDiaryLoader}: _Context
    )
    {
        if (groupActivity.workoutDiaryId)
        {
            return workoutDiaryLoader.load(groupActivity.workoutDiaryId)
        }
        return null
    }

    @FieldResolver(() => FoodDiary)
    foodDiary(
        @Root() groupActivity: GroupActivity,
        @Ctx() {foodDiaryLoader}: _Context
    )
    {
        if (groupActivity.foodDiaryId)
        {
            return foodDiaryLoader.load(groupActivity.foodDiaryId)
        }
        return null
    }

    @FieldResolver(() => WeightHistory)
    weightHistory(
        @Root() groupActivity: GroupActivity,
        @Ctx() {weightHistoryLoader}: _Context
    )
    {   
        if (groupActivity.weightHistoryId)
        {
            return weightHistoryLoader.load(groupActivity.weightHistoryId)
        }
        return null
    }

    @FieldResolver(() => User)
    user(
        @Root() groupActivity: GroupActivity,
        @Ctx() {userLoader}: _Context
    )
    {
        return userLoader.load(groupActivity.userId)
    }

    @Query(() => PaginatedActivity)
    async activities(
        @Arg("limit", () => Int, {nullable: true}) limit: number,
        @Arg("cursor", () => String, {nullable: true}) cursor: string | null,
        @Ctx() {req}: _Context
    ): Promise<PaginatedActivity | null>
    {

        if (!req.session.userId) return null

        const group = await GroupMembers.findOne({userMemberId: req.session.userId})

        let max = Math.min(20, limit)
        const maxPlusOne = max + 1

        const queryArr: any[] = [maxPlusOne]

        if (cursor) queryArr.push(new Date(cursor))

        const result = getConnection()
            .getRepository(GroupActivity)
            .createQueryBuilder("grp")
            .orderBy('grp."createdAt"', "DESC")
            .take(maxPlusOne)
            .where('grp."groupId" = :groupId', {groupId: group?.groupId})
        if (cursor) result.where('grp. "createdAt" < :cursor', {cursor: new Date(parseInt(cursor))})

        const activities = await result.getMany()

        return { activities: activities.slice(0, max), hasMore: activities.length === maxPlusOne}
    }

}