import { testConnection } from "../testutils/testConnection";
import { Connection } from "typeorm";
import { graphqlCall } from "../testutils/graphqlCall";
import { Group } from "../entities/groupEntity";
import { GroupMembers } from "../entities/groupMembersEntity";
import { User } from "../entities/userEntity";

let con: Connection

beforeAll(async () => {
    con = await testConnection()
})

afterAll(async () => {
    await con.close()
})

const createGroupMutation = `
    mutation CreateGroup($name:String!){
        createGroup(name:$name){
            errors{
                field
                message
            }
            group{
                name
            }
        }
    }
`

const deleteGroupMutation = `
    mutation DeleteGroup($id:Int!){
        deleteGroup(id:$id)
    }
`

const kickMemberMutation = `
    mutation KickMember($username:String!){
        kickMember(username:$username)
    }
`

const checkIfOwnerQuery = `
    query CheckIfOwner{
        checkIfOwner
    }
`

const getGroupByUserQuery = `
    query GetGroupByUser{
        getGroupByUser{
            id
            name
            creatorId
        }
    }
`



describe("CreateGroup", () => {
    it("creates a new group with specific name", async () => {
        const response = await graphqlCall({
            source: createGroupMutation,
            variableValues: {
                name: "test group"
            }
        })

        expect(response).toMatchObject({
            data: {
                createGroup: {
                    errors: null,
                    group: {
                        name: "test group"
                    }
                }
            }
        })

        //test to check if group exists in db
        const findGroup = await Group.findOne({where: {name: "test group"}})
        expect(findGroup).toBeDefined()

        //test to check if user is owner of created group
        const groupMember = await GroupMembers.findOne({where: {groupId: findGroup?.id}})
        expect(groupMember?.isOwner).toEqual(true)

        const duplicateCheck = await graphqlCall({
            source: createGroupMutation,
            variableValues: {
                name: "test group"
            }
        })

        expect(duplicateCheck).toMatchObject({
            data: {
                createGroup: {
                    errors: [
                        {
                            field: "name",
                            message: "You are already part of / own a group"
                        }
                    ],
                    group: null
                }
            }
        })
    })
})

describe("DeleteGroup", () => {
    it("deletes a group by id, deletes all members of said group", async () => {
        const response = await graphqlCall({
            source: deleteGroupMutation,
            variableValues: {
                id: 1
            }
        })

        expect(response).toMatchObject({
            data: {
                deleteGroup: true
            }
        })

        //expect deleted group to not be found within db
        const findGroup = await Group.findOne({where: {name: "test group"}})
        expect(findGroup).toBeFalsy()

        const groupMember = await GroupMembers.findOne({where: {groupId: findGroup?.id}})
        expect(groupMember).toBeFalsy()
    })
}) 

describe("KickMember", () => {
    it("removes member from group and deletes entry from db", async () => {
        const response = await graphqlCall({
            source: kickMemberMutation,
            variableValues: {
                username: "testuser"
            }
        })

        expect(response).toMatchObject({
            data: {
                kickMember: true
            }
        })

        const user = await User.findOne({where: {username: "testuser"}})
        const groupMember = await GroupMembers.findOne({where: {userMemberId: user?.id}})
        expect(groupMember).toBeFalsy()
    })
})

describe("CheckIfOwner", () => {
    it ("checks if currently logged in user is the owner of group they are in", async () => {
        //create group to check if user is owner
        await graphqlCall({
            source: createGroupMutation,
            variableValues: {
                name: "checkifowner test"
            }
        })

        const responseOwnedTrue = await graphqlCall({
            source: checkIfOwnerQuery
        })
        
        expect(responseOwnedTrue).toMatchObject({
            data: {
                checkIfOwner:  true
            }
        })
        expect(responseOwnedTrue).toBeTruthy()

        //delete group to ensure false is returned
        await graphqlCall({
            source: deleteGroupMutation,
            variableValues: {
                id: 2
            }
        })

        const responseOwnedFalse = await graphqlCall({
            source: checkIfOwnerQuery
        })
        
        expect(responseOwnedFalse).toMatchObject({
            data: {
                checkIfOwner:  false
            }
        })
        expect(responseOwnedFalse).toBeFalsy()

    })
})

describe("GetGroupByUser", () => {
    it("gets user by currently logged in user", async () => {
        const response = await graphqlCall({
            source: getGroupByUserQuery,
        })

        expect(response).toMatchObject({
            data: {
                getGroupByUser: {
                    name: "test group"
                }
            }
        })
    })
})