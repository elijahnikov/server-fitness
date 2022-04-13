import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Group } from "./groupEntity";

@ObjectType()
@Entity()
export class GroupInvites extends BaseEntity 
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

    @Field(() => Group)
    @ManyToOne(() => Group, (group) => group.invites, {
        onDelete: 'CASCADE'
    })
    group: Group; 

    @Field()
    @Column()
    groupId: number;

    @Field()
    @Column()
    userMemberId: number;
}
