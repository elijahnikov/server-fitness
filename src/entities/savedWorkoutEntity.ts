import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./userEntity";
import { WorkoutDiary } from "./workoutDiaryEntity";

@ObjectType()
@Entity()
export class SavedWorkout extends BaseEntity 
{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string

    @Field()
    @Column()
    type!: string

    @Field({nullable: true})
    @Column({nullable: true})
    sets: string

    @Field({nullable: true})
    @Column({nullable: true})
    reps: string

    @Field({nullable: true})
    @Column({nullable: true})
    weight: number

    @Field({nullable: true})
    @Column({nullable: true})
    duration: number

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    //____________________ENTITY RELATIONSHIPS______________________
    //______________________________________________________________
    //______________________________________________________________

    @Field()
    @Column()
    userId: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.savedWorkouts)
    user: User;

    @ManyToOne(() => WorkoutDiary, (workoutDiary) => workoutDiary.workouts)
    workoutDiary: WorkoutDiary;
}
