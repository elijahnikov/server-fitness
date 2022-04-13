import { SavedWorkout } from "../../entities/savedWorkoutEntity";
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { WorkoutDiary } from "../../entities/workoutDiaryEntity";
import { _Context } from "../../types";
import { checkAuth } from "../../utils/checkAuth";
import { WorkoutDiaryInput } from "../input/workoutDiaryInput";
import { getConnection } from "typeorm";
import { GroupMembers } from "../../entities/groupMembersEntity";
import { GroupActivity } from "../../entities/groupActivityEntity";
import { User } from "../../entities/userEntity";


@ObjectType()
class GetWorkoutEntries
{
    @Field(() => [WorkoutDiary])
    workoutDiary: WorkoutDiary[]
}

@Resolver(WorkoutDiary)
export class WorkoutDiaryResolver
{
    
    @FieldResolver(() => SavedWorkout)
    workout(
        @Root() workoutDiary: WorkoutDiary,
        @Ctx() {workoutLoader}: _Context
    ){
        return workoutLoader.load(workoutDiary.workoutId)
    }

    @Mutation(() => WorkoutDiary)
    @UseMiddleware(checkAuth)
    async newWorkoutDiaryEntry(
        @Arg("input") input: WorkoutDiaryInput,
        @Ctx() {req}: _Context
    ): Promise<WorkoutDiary | null>
    {

        if (!req.session.userId) return null

        const groupCheck = await GroupMembers.findOne({userMemberId: req.session.userId})

        //create new entry
        const newEntry = await WorkoutDiary.create({
            type: input.type,
            workoutId: input.workoutId,
            userId: req.session.userId,
            weight: input.weight,
            duration: input.duration
        }).save()

        //update users total workouts logged
        await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({
                totalWorkoutsLogged: () => '"totalWorkoutsLogged" + 1'
            })
            .where("id = :id", {id: req.session.userId})
            .execute()

        if (groupCheck)
        {
            await GroupActivity.create({
                groupId: groupCheck.groupId,
                workoutDiaryId: newEntry.id,
                userId: req.session.userId
            }).save()
        }

        return newEntry
    }

    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async deleteWorkoutDiaryEntry(
        @Arg("id", () => Int) id: number,
        @Ctx() {req}: _Context
    ): Promise<boolean>
    {
        await WorkoutDiary.delete({id, userId: req.session.userId})
        return true;
    }

    @Query(() => GetWorkoutEntries)
    async getWorkoutDiary(
        @Arg('date') date: string,
        @Arg('limit', () => Int, {nullable: true}) limit: number, 
        @Ctx() {req}: _Context
    ): Promise<GetWorkoutEntries | undefined>
    {
        const {userId} = req.session
        const replacements: any[] = [userId, date]

        if (limit) replacements.push(limit)
        else replacements.push(null)

        const diary = await getConnection().query(`
            select wd.*
            from workout_diary wd
            where wd."userId" = $1 and wd."createdAt"::date = $2
            order by wd."createdAt" DESC
            limit $3
        `, replacements)

        return { workoutDiary: diary }
    }

}