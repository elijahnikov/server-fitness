import DataLoader from "dataloader";
import { WorkoutDiary } from "../entities/workoutDiaryEntity";

export const workoutDiaryLoader = () => new DataLoader<number, WorkoutDiary>(async (workoutDiaryIds) => {
    const workoutDiaries = await WorkoutDiary.findByIds(workoutDiaryIds as number[])
    const workoutDiaryIdToWorkoutDiary: Record<number, WorkoutDiary> = {};
    workoutDiaries.forEach(wd => {
        workoutDiaryIdToWorkoutDiary[wd.id] = wd
    })
    return workoutDiaryIds.map((workoutDiaryId) => workoutDiaryIdToWorkoutDiary[workoutDiaryId])
})