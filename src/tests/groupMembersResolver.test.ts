import { testConnection } from "../testutils/testConnection";
import { Connection } from "typeorm";
import { graphqlCall } from "../testutils/graphqlCall";
import { GroupInvites } from "../entities/groupInvitesEntity";
import { User } from "../entities/userEntity";
import { GroupMembers } from "../entities/groupMembersEntity";

let con: Connection

beforeAll(async () => {
    con = await testConnection()
})

afterAll(async () => {
    await con.close()
})

const createInviteMutation = `
    mutation CreateInvite($username:String!){
        createInvite(username:$username){
            id
            groupId
            userMemberId
        }
    }
`

const acceptResponseMutation = `
    mutation AcceptResponse{
        acceptResponse
    }
`

const declineResponseMutation = `
    mutation DeclineResponse{
        declineResponse
    }
`

describe("CreateInvite", () => {
    it("creates an invite for a user found by username", async () => {
        const response = await graphqlCall({
            source: createInviteMutation,
            variableValues: {
                username: "testuser"
            }
        })

        expect(response).toMatchObject({
            data: {
                createInvite: {
                    id: 3,
                    groupId: 3,
                    userMemberId: 2
                }
            }
        })

        const user = await User.findOne({where: {username: "testuser"}})
        const groupInvite = await GroupInvites.findOne({where: {userMemberId: user?.id}})
        expect(groupInvite).toBeDefined()
    })
})

describe("AcceptResponse", () => {
    it("accept response for group invite", async () => {
        const response = await graphqlCall({
            source: acceptResponseMutation,
        })

        expect(response).toMatchObject({
            data: {
                acceptResponse: true
            }
        })

        const groupInvite = await GroupInvites.findOne({where: {groupId: 3}})
        expect(groupInvite).toBeUndefined()

        const groupMember = await GroupMembers.findOne({where: {userMemberId: 2}})
        expect(groupMember).toBeDefined()
    })
})

describe("DeclineResponse", () => {
    it("decline response for group invite", async () => {
        const response = await graphqlCall({
            source: declineResponseMutation
        })

        expect(response).toMatchObject({
            data: {
                declineResponse: true
            }
        })

        const groupInvite = await GroupInvites.findOne({where: {groupId: 3}})
        expect(groupInvite).toBeUndefined()
    })
})