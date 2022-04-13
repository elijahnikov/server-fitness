import DataLoader from "dataloader";
import { FoodDiary } from "../entities/foodDiaryEntity";

export const foodDiaryLoader = () => new DataLoader<number, FoodDiary>(async (foodDiaryIds) => {
    const foodDiaries = await FoodDiary.findByIds(foodDiaryIds as number[])
    const foodDiaryIdToFoodDiary: Record<number, FoodDiary> = {}
    foodDiaries.forEach(fd => {
        foodDiaryIdToFoodDiary[fd.id] = fd
    })
    return foodDiaryIds.map((foodDiaryId) => foodDiaryIdToFoodDiary[foodDiaryId])
})