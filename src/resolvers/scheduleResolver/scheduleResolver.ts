import { Schedule } from "../../entities/scheduleEntity";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { _Context } from "../../types";
import { ScheduleInput } from "../input/scheduleInput";
import { getConnection } from "typeorm";
import { checkAuth } from "../../utils/checkAuth";
import { User } from "../../entities/userEntity";

@ObjectType()
class GetActivities
{
    @Field(() => [Schedule])
    activities: Schedule[]
}

@Resolver(Schedule)
export class ScheduleResolver 
{
    //create new activity in schedule
    @Mutation(() => Schedule)
    @UseMiddleware(checkAuth)
    async createActivity(
        @Arg("input") input: ScheduleInput,
        @Ctx() {req}: _Context
    ): Promise<Schedule | null>
    {
        if (!req.session.userId) return null

        await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({
                totalWorkoutsLogged: () => '"totalActivitiesScheduled" + 1'
            })
            .where("id = :id", {id: req.session.userId})
            .execute()

        return Schedule.create({
            title: input.title,
            type: input.type,
            day: input.day,
            duration: input.duration,
            userId: req.session.userId
        }).save()
    }

    //delete activity from schedule
    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async deleteActivity(
        @Arg("id", () => Int) id: number,
        @Ctx() {req}: _Context
    ): Promise<Boolean>
    {
        await Schedule.delete({id, userId: req.session.userId})
        return true;
    }

    //get activities by user ID
    @Query(() => GetActivities)
    async activitiesByUser(
        @Ctx() {req}: _Context,
    ): Promise<GetActivities | undefined>
    {
        const {userId} = req.session

        const results = getConnection()
            .getRepository(Schedule)
            .createQueryBuilder("act")
            .take()
            .where("act.userId = :id", {id: userId})

        const activities = await results.getMany()

        return {activities: activities}
    }

    @Query(() => GetActivities)
    async getActivityByUserByDay(
        @Ctx() {req}: _Context,
        @Arg("day") day: string,
    ): Promise<GetActivities | undefined>
    {
        const {userId} = req.session

        const results = getConnection()
            .getRepository(Schedule)
            .createQueryBuilder("act")
            .take(3)
            .where("act.userId = :id", {id: userId})
        if (day)
        {
            results.andWhere("act.day = :day", {day: day})
        }

        const activities = await results.getMany()

        return {activities: activities}
    }
}