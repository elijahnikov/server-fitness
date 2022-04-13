import { FoodDiaryResolver } from "../resolvers/foodWorkoutResolver/foodDiaryResolver";
import { SavedFoodResolver } from "../resolvers/foodWorkoutResolver/savedFoodResolver";
import { SavedWorkoutResolver } from "../resolvers/foodWorkoutResolver/savedWorkoutResolver";
import { WorkoutDiaryResolver } from "../resolvers/foodWorkoutResolver/workoutDiaryResolver";
import { GroupActivityResolver } from "../resolvers/groupResolver/groupActivityResolver";
import { GroupInvitesResolver } from "../resolvers/groupResolver/groupInviteResolver";
import { GroupMembersResolver } from "../resolvers/groupResolver/groupMembersResolver";
import { GroupResolver } from "../resolvers/groupResolver/groupResolver";
import { ScheduleResolver } from "../resolvers/scheduleResolver/scheduleResolver";
import { UserResolver } from "../resolvers/userResolver/userResolver";
import { WeightHistoryResolver } from "../resolvers/weightResolver/weightHistoryResolver";
import { buildSchema } from "type-graphql";

export const createSchema = () => buildSchema({
    resolvers: [
        UserResolver, 
        SavedFoodResolver, 
        SavedWorkoutResolver,
        ScheduleResolver,
        FoodDiaryResolver,
        WorkoutDiaryResolver,
        GroupResolver,
        GroupInvitesResolver,
        GroupMembersResolver,
        GroupActivityResolver,
        WeightHistoryResolver
    ],
    authChecker: ({context: {req}}) => {
        return !!req.session.userId
    }
})