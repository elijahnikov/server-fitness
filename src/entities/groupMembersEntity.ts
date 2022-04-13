import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Group } from "./groupEntity";
import { User } from "./userEntity";

@ObjectType()
@Entity()
export class GroupMembers extends BaseEntity 
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

    @Field()
    @Column()
    groupId: number;

    @Field()
    @Column()
    userMemberId: number;
    
    @Field()
    @Column({default: false})
    isOwner: boolean

    @Field(() => User)
    @OneToOne(() => User, user => user.groupmember)
    user: User;  

    @ManyToOne(() => Group, (group) => group.members, {
        onDelete: 'CASCADE'
    })
    group: Group;
}
