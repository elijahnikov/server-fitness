import DataLoader from "dataloader";
import { WeightHistory } from "../entities/weightHistoryEntity";

export const weightHistoryLoader = () => new DataLoader<number, WeightHistory>(async (weightHistoryIds) => {
    const weightHistories = await WeightHistory.findByIds(weightHistoryIds as number[])
    const weightHistoryIdToWeightHistory: Record<number, WeightHistory> = {}
    weightHistories.forEach(wh => {
        weightHistoryIdToWeightHistory[wh.id] = wh
    })
    return weightHistoryIds.map((weightHistoryId) => weightHistoryIdToWeightHistory[weightHistoryId])
})