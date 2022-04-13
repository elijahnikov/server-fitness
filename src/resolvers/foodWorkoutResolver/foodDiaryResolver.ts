import { FoodDiary } from "../../entities/foodDiaryEntity";
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { _Context } from "../../types";
import { FoodDiaryInput } from "../input/foodDiaryInput";
import { checkAuth } from "../../utils/checkAuth";
import { getConnection } from "typeorm";
import { SavedFood } from "../../entities/savedFoodEntity";
import { GroupMembers } from "../../entities/groupMembersEntity";
import { GroupActivity } from "../../entities/groupActivityEntity";
import { User } from "../../entities/userEntity";

@ObjectType()
class GetFoodEntries 
{
    @Field(() => [FoodDiary])
    foodDiary: FoodDiary[]
}


@Resolver(FoodDiary)
export class FoodDiaryResolver
{

    @FieldResolver(() => SavedFood)
    food(
        @Root() foodDiary: FoodDiary,
        @Ctx() {foodLoader}: _Context
    ){
        return foodLoader.load(foodDiary.foodId)
    }

    @Mutation(() => FoodDiary)
    @UseMiddleware(checkAuth)
    async newFoodDiaryEntry(
        @Arg("input") input: FoodDiaryInput,
        @Ctx() {req}: _Context
    ): Promise<FoodDiary | null>
    {
        if (!req.session.userId) return null

        const user = await User.findOne({id: req.session.userId})
        if (!user) return null

        const groupCheck = await GroupMembers.findOne({userMemberId: req.session.userId})

        const newEntry = await FoodDiary.create({
            type: input.type,
            calorieTarget: user.calorieTarget,
            foodId: input.foodId,
            userId: req.session.userId 
        }).save()

        await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({
                totalMealsLogged: () => '"totalMealsLogged" + 1'
            })
            .where("id = :id", {id: req.session.userId})
            .execute()

        if (groupCheck)
        {
            await GroupActivity.create({
                groupId: groupCheck.groupId,
                foodDiaryId: newEntry.id,
                userId: req.session.userId
            }).save()
        }

        return newEntry
    }

    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async deleteFoodDiaryEntry(
        @Arg("id", () => Int) id: number,
        @Ctx() {req}: _Context
    ): Promise<boolean>
    {
        await FoodDiary.delete({id, userId: req.session.userId})
        return true;
    }

    @Query(() => GetFoodEntries)
    async getFoodDiary(
        @Arg('date') date: string,
        @Arg('limit', () => Int, {nullable: true}) limit: number,
        @Ctx() {req}: _Context
    ): Promise<GetFoodEntries | undefined>
    {
        const {userId} = req.session
        const replacements: any[] = [userId, date]

        if (limit) replacements.push(limit)
        else replacements.push(null)

        const diary = await getConnection().query(`
            select fd.*
            from food_diary fd
            where fd."userId" = $1 and fd."createdAt"::date = $2
            order by fd."createdAt" ASC 
            limit $3
        `, replacements)

        return {foodDiary: diary}
    }

}