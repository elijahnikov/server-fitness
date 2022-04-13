import DataLoader from "dataloader";
import { SavedWorkout } from "../entities/savedWorkoutEntity";

export const workoutLoader = () => new DataLoader<number, SavedWorkout>(async (workoutIds) => {
    const workouts = await SavedWorkout.findByIds(workoutIds as number[])
    const workoutIdToWorkout: Record<number, SavedWorkout> = {};
    workouts.forEach(w => {
        workoutIdToWorkout[w.id] = w;
    })
    return workoutIds.map((workoutId) => workoutIdToWorkout[workoutId])
})