import DataLoader from 'dataloader'
import { SavedFood } from '../entities/savedFoodEntity';

export const foodLoader = () => new DataLoader<number, SavedFood>(async (foodIds) => {
    const foods = await SavedFood.findByIds(foodIds as number[])
    const foodIdToFood: Record<number, SavedFood> = {};
    foods.forEach(f => {
        foodIdToFood[f.id] = f;
    })
    return foodIds.map((foodId) => foodIdToFood[foodId]) 
})