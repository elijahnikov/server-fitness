import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FoodDiary } from "./foodDiaryEntity";
import { User } from "./userEntity";

@ObjectType()
@Entity()
export class SavedFood extends BaseEntity 
{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string

    @Field()
    @Column()
    serving!: number

    @Field()
    @Column()
    calories!: number

    @Field()
    @Column()
    protein!: number

    @Field({nullable: true})
    @Column({nullable: true})
    pictureUrl: string

    @Field()
    @Column()
    carbs!: number

    @Field()
    @Column()
    fat!: number

    @Field()
    @Column()
    type!: string
    
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
    @ManyToOne(() => User, (user) => user.savedFoods)
    user: User;

    @Field(() => FoodDiary, {nullable: true})
    @OneToMany(() => FoodDiary, (foodDiary) => foodDiary.food)
    foodDiary: FoodDiary;
}
