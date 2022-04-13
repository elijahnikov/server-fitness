import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupActivity } from "./groupActivityEntity";
import { GroupInvites } from "./groupInvitesEntity";
import { GroupMembers } from "./groupMembersEntity";

@ObjectType()
@Entity()
export class Group extends BaseEntity 
{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string

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
    creatorId: number

    @OneToMany(() => GroupMembers, groupMembers => groupMembers.group)
    members: GroupMembers[]

    @OneToMany(() => GroupActivity, groupActivity => groupActivity.group)
    groupActivity: GroupActivity[]

    @OneToMany(() => GroupInvites, groupInvites => groupInvites.group)
    invites: GroupInvites[]
}
