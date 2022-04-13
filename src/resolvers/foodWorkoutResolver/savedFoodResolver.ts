import { SavedFood } from "../../entities/savedFoodEntity";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { _Context } from "../../types";
import { getConnection } from "typeorm";
import { SavedFoodInput } from "../input/savedFoodInput";
import { checkAuth } from "../../utils/checkAuth";
import { FoodDiary } from "../../entities/foodDiaryEntity";
import { User } from "../../entities/userEntity";

@ObjectType()
class GetFoods {
    @Field(() => [SavedFood])
    foods: SavedFood[]
}

@Resolver(SavedFood)
export class SavedFoodResolver 
{
    
    //create saved food
    @Mutation(() => SavedFood)
    @UseMiddleware(checkAuth)
    async createSavedFood(
        @Arg("input") input: SavedFoodInput,
        @Ctx() {req}: _Context
    ): Promise<SavedFood | null>
    {
        if (!req.session.userId) return null

        await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({
                totalMealsSaved: () => '"totalMealsSaved" + 1'
            })
            .where("id = :id", {id: req.session.userId})
            .execute()

        return SavedFood.create({
            userId: req.session.userId,
            title: input.title,
            serving: input.serving,
            calories: input.calories,
            protein: input.protein,
            carbs: input.carbs,
            fat: input.fat,
            type: input.type,
            pictureUrl: input.pictureUrl
        }).save()
    }

    //delete saved food
    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async deleteSavedFood(
        @Arg("id", () => Int) id: number,
        @Ctx() {req}: _Context
    ): Promise<boolean>
    {   
        await SavedFood.delete({id, userId: req.session.userId})
        await FoodDiary.delete({foodId: id, userId: req.session.userId})
        return true;
    }
    
    //update saved food
    @Mutation(() => SavedFood, {nullable: true})
    @UseMiddleware(checkAuth)
    async updateSavedFood(
        @Arg("id", () => Int) id: number,
        @Arg("input") input: SavedFoodInput,
        @Ctx() {req}: _Context
    ): Promise<SavedFood | null>
    {
        const result = await getConnection()
            .createQueryBuilder()
            .update(SavedFood)
            .set({...input})
            .where('id = :id and "userId" = :userId', {id, userId: req.session.userId})
            .returning("*")
            .execute()

        return result.raw[0]
    }

    //get saved food by user ID
    @Query(() => GetFoods)
    async foods(
        @Arg("type", {nullable: true}) type: String,
        @Arg("title", {nullable: true}) title: String,
        @Arg('limit', () => Int, {nullable: true}) limit: number,
        @Ctx() {req}: _Context
    ): Promise<GetFoods> 
    {

        const {userId} = req.session

        const results = getConnection()
            .getRepository(SavedFood)
            .createQueryBuilder("food")
            .orderBy('food."createdAt"', 'DESC')
            .where('food.userId = :id', {id: userId})
        if (type)
            results.andWhere('food."type" = :type', {type: type})
        if (title)
            results.andWhere('LOWER(food."title") like LOWER(:title)', {title: `${title.toLowerCase()}%`})
        if (limit)
            results.take(limit)

        const foods = await results.getMany()

        return {foods: foods}
    }

}