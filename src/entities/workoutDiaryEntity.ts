import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupActivity } from "./groupActivityEntity";
import { SavedWorkout } from "./savedWorkoutEntity";
import { User } from "./userEntity";

@ObjectType()
@Entity()
export class WorkoutDiary extends BaseEntity 
{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    type!: string

    @Field({nullable: true})
    @Column({nullable: true})
    weight!: number

    @Field({nullable: true})
    @Column({nullable: true})
    duration!: number

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
    @ManyToOne(() => User, (user) => user.workoutDiaries)
    user: User;

    @Field()
    @Column()
    workoutId: number;

    @Field(() => SavedWorkout)
    @OneToMany(() => SavedWorkout, (savedWorkout) => savedWorkout.workoutDiary)
    workouts: SavedWorkout[]

    @OneToMany(() => GroupActivity, (groupActivity) => groupActivity.workoutDiary)
    groupActivity: GroupActivity
}
