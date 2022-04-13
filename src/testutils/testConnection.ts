import { FoodDiary } from "../entities/foodDiaryEntity"
import { GroupActivity } from "../entities/groupActivityEntity"
import { Group } from "../entities/groupEntity"
import { GroupInvites } from "../entities/groupInvitesEntity"
import { GroupMembers } from "../entities/groupMembersEntity"
import { SavedFood } from "../entities/savedFoodEntity"
import { SavedWorkout } from "../entities/savedWorkoutEntity"
import { Schedule } from "../entities/scheduleEntity"
import { User } from "../entities/userEntity"
import { WeightHistory } from "../entities/weightHistoryEntity"
import { WorkoutDiary } from "../entities/workoutDiaryEntity"
import { createConnection } from "typeorm"

export const testConnection = (drop: boolean = false) => {
    return createConnection({
        name: "default",
        type: 'postgres',
        url: "postgresql://postgres:postgres@localhost:5432/testfitness",
        synchronize: drop,
        dropSchema: drop,
        entities: [
            User,
            SavedFood,
            SavedWorkout,
            FoodDiary,
            WorkoutDiary,
            Schedule,
            WeightHistory,
            Group,
            GroupMembers,
            GroupActivity,
            GroupInvites
        ]
    })
}