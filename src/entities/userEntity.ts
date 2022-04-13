import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FoodDiary } from "./foodDiaryEntity";
import { GroupActivity } from "./groupActivityEntity";
import { GroupMembers } from "./groupMembersEntity";
import { SavedFood } from "./savedFoodEntity";
import { SavedWorkout } from "./savedWorkoutEntity";
import { Schedule } from "./scheduleEntity";
import { WeightHistory } from "./weightHistoryEntity";
import { WorkoutDiary } from "./workoutDiaryEntity";

@ObjectType()
@Entity()
export class User extends BaseEntity 
{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique: true})
    username!: string;

    @Field({nullable: true})
    @Column({nullable: true})
    displayName: string;

    @Field()
    @Column({unique: true})
    email!: string;

    @Column()
    password!: string;

    @Field({nullable: true})
    @Column({nullable: true})
    avatar: string;

    @Field({nullable: true})
    @Column({nullable: true, type: 'int'})
    currentWeight: number;

    @Field({nullable: true})
    @Column({nullable: true, type: 'int'})
    goalWeight: number

    @Field({nullable: true})
    @Column({nullable: true, type: 'int'})
    heightFeet: number;

    @Field({nullable: true})
    @Column({nullable: true, type: 'int'})
    heightInches: number;

    @Field({nullable: true})
    @Column({nullable: true, type: 'int'})
    age: number;

    @Field({nullable: true})
    @Column({nullable: true})
    gender: string;

    @Field({nullable: true})
    @Column({nullable: true})
    activityLevel: string;

    @Field({nullable: true})
    @Column({nullable: true})
    calorieTarget: number;
    
    @Field({nullable: true})
    @Column({nullable: true, default: 0})
    totalWorkoutsLogged: number

    @Field({nullable: true})
    @Column({nullable: true, default: 0})
    totalMealsLogged: number

    @Field({nullable: true})
    @Column({nullable: true, default: 0})
    totalWorkoutsSaved: number

    @Field({nullable: true})
    @Column({nullable: true, default: 0})
    totalMealsSaved: number

    @Field({nullable: true})
    @Column({nullable: true, default: 0})
    totalActivitiesScheduled: number

    //____________________ENTITY RELATIONSHIPS______________________
    //______________________________________________________________
    //______________________________________________________________
    
    //SAVED FOODS AND WORKOUTS
    //______________________________________________________________
    @OneToMany(() => SavedFood, savedFood => savedFood.user)
    savedFoods: SavedFood[];

    @OneToMany(() => SavedWorkout, (savedWorkout) => savedWorkout.user)
    savedWorkouts: SavedWorkout[];

    //DIARIES
    //______________________________________________________________
    @OneToMany(() => FoodDiary, (foodDiary) => foodDiary.user)
    foodDiaries: FoodDiary[]

    @OneToMany(() => WorkoutDiary, (workoutDiary) => workoutDiary.user)
    workoutDiaries: WorkoutDiary[]

    //SCHEDULE
    //______________________________________________________________
    @OneToMany(() => Schedule, (schedule) => schedule.user)
    schedules: Schedule[]

    //WEIGHT HISTORY
    //______________________________________________________________
    @OneToMany(() => WeightHistory, (weightHistory) => weightHistory.user)
    weightHistories: WeightHistory[]

    //GROUP
    //______________________________________________________________
    @OneToOne(() => GroupMembers, groupMembers => groupMembers.user)
    groupmember: GroupMembers

    @OneToMany(() => GroupActivity, groupActivity => groupActivity.user)
    groupActivity: GroupActivity[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}