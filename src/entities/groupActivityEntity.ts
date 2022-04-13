import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FoodDiary } from "./foodDiaryEntity";
import { Group } from "./groupEntity";
import { User } from "./userEntity";
import { WeightHistory } from "./weightHistoryEntity";
import { WorkoutDiary } from "./workoutDiaryEntity";

@ObjectType()
@Entity()
export class GroupActivity extends BaseEntity 
{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;


    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    //____________________ENTITY RELATIONSHIPS______________________
    //______________________________________________________________
    //______________________________________________________________
    
    @ManyToOne(() => Group, (group) => group.groupActivity)
    group: Group;

    @Field(() => FoodDiary, {nullable: true})
    @ManyToOne(() => FoodDiary, (foodDiary) => foodDiary.groupActivity, {nullable: true, onDelete: 'CASCADE'})
    foodDiary: FoodDiary

    @Field(() => WorkoutDiary, {nullable: true})
    @ManyToOne(() => WorkoutDiary, (workoutDiary) => workoutDiary.groupActivity, {nullable: true, onDelete: 'CASCADE'})
    workoutDiary: WorkoutDiary

    @Field(() => WeightHistory, {nullable: true})
    @ManyToOne(() => WeightHistory, (weightHistory) => weightHistory.groupActivity, {nullable: true, onDelete: 'CASCADE'})
    weightHistory: WeightHistory
    
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.groupActivity)
    user: User;

    @Field()
    @Column()
    userId: number;
    
    @Field({nullable: true})
    @Column({nullable: true})
    foodDiaryId: number

    @Field({nullable: true})
    @Column({nullable: true})
    workoutDiaryId: number

    @Field({nullable: true})
    @Column({nullable: true})
    weightHistoryId: number

    @Field()
    @Column()
    groupId: number;

}
