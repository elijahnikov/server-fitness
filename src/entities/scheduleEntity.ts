import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./userEntity";

@ObjectType()
@Entity()
export class Schedule extends BaseEntity 
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

    @Field()
    @Column()
    day!: string

    @Field()
    @Column()
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
    @ManyToOne(() => User, (user) => user.schedules)
    user: User;
}
