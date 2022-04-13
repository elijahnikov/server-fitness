import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupActivity } from "./groupActivityEntity";
import { User } from "./userEntity";

@ObjectType()
@Entity()
export class WeightHistory extends BaseEntity 
{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    weight!: number

    @Field({nullable: true})
    @Column({nullable: true})
    previousWeight: number

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
    @ManyToOne(() => User, (user) => user.weightHistories)
    user: User;

    @OneToMany(() => GroupActivity, (groupActivity) => groupActivity.weightHistory)
    groupActivity: GroupActivity
}
