import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupActivity } from "./groupActivityEntity";
import { SavedFood } from "./savedFoodEntity";
import { User } from "./userEntity";

@ObjectType()
@Entity()
export class FoodDiary extends BaseEntity 
{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    type!: string

    @Field()
    @Column()
    calorieTarget!: number;
    
    @Field()
    @Column()
    userId!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    //____________________ENTITY RELATIONSHIPS______________________
    //______________________________________________________________
    //______________________________________________________________
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.foodDiaries)
    user: User;

    @Field()
    @Column()
    foodId: number;

    @Field(() => SavedFood)
    @OneToMany(() => SavedFood, (savedFood) => savedFood.foodDiary)
    food: SavedFood;

    @OneToMany(() => GroupActivity, (groupActivity) => groupActivity.foodDiary)
    groupActivity: GroupActivity
}
