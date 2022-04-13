import { SavedWorkout } from "../../entities/savedWorkoutEntity";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { _Context } from "../../types";
import { SavedWorkoutInput } from "../input/savedWorkoutInput";
import { getConnection } from "typeorm";
import { checkAuth } from "../../utils/checkAuth";
import { WorkoutDiary } from "../../entities/workoutDiaryEntity";
import { User } from "../../entities/userEntity";

@ObjectType()
class GetWorkouts {
    @Field(() => [SavedWorkout])
    workouts: SavedWorkout[]
}

@Resolver(SavedWorkout)
export class SavedWorkoutResolver
{
    //create new saved workout
    @Mutation(() => SavedWorkout)
    @UseMiddleware(checkAuth)
    async createSavedWorkout(
        @Arg("input") input: SavedWorkoutInput,
        @Ctx() {req}: _Context
    ): Promise<SavedWorkout | null>
    {
        if (!req.session.userId) return null

        await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({
                totalWorkoutsSaved: () => '"totalWorkoutsSaved" + 1'
            })
            .where("id = :id", {id: req.session.userId})
            .execute()

        return SavedWorkout.create({
            title: input.title,
            sets: input.sets,
            reps: input.reps,
            type: input.type,
            weight: input.weight,
            duration: input.duration,
            userId: req.session.userId
        }).save()
    }

    //delete saved workout
    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async deleteSavedWorkout(
        @Arg("id", () => Int) id: number,
        @Ctx() {req}: _Context
    ): Promise<boolean>
    {
        await SavedWorkout.delete({id, userId: req.session.userId})
        await WorkoutDiary.delete({workoutId: id, userId: req.session.userId})
        return true;
    }

    //update saved workout
    @Mutation(() => SavedWorkout, {nullable: true})
    @UseMiddleware(checkAuth)
    async updateSavedWorkout(
        @Arg("id", () => Int) id: number,
        @Arg("input") input: SavedWorkoutInput,
        @Ctx() {req}: _Context
    ): Promise<SavedWorkout | null>
    {
        const result = await getConnection()
            .createQueryBuilder()
            .update(SavedWorkout)
            .set({...input})
            .where('id = :id and "userId" = :userId', {id, userId: req.session.userId})
            .returning("*")
            .execute()

        return result.raw[0]
    }

    //get saved workout by user ID
    @Query(() => GetWorkouts)
    async workouts(
        @Arg("type", {nullable: true}) type: string,
        @Arg("title", {nullable: true}) title: String,
        @Arg("limit", () => Int, {nullable: true}) limit: number,
        @Ctx() {req}: _Context
    ): Promise<GetWorkouts>
    {

        const {userId} = req.session

        const results = getConnection()
            .getRepository(SavedWorkout)
            .createQueryBuilder("wrk")
            .orderBy('wrk."createdAt"', 'DESC')
            .where("wrk.userId = :id", {id: userId})
        if (type)
            results.andWhere('wrk."type" = :type', {type: type})
        if (title)
            results.andWhere('LOWER(wrk."title") like LOWER(:title)', {title: `${title.toLowerCase()}%`})
        if (limit)
            results.take(limit)

        const workouts = await results.getMany()

        return {workouts: workouts}
    }
} 