import { testConnection } from "../testutils/testConnection";
import { Connection } from "typeorm";
import { graphqlCall } from "../testutils/graphqlCall";
import { Schedule } from "../entities/scheduleEntity";

let con: Connection;

beforeAll(async () => {
    con = await testConnection()
})

afterAll(async () => {
    await con.close()
})

const createActivityMutation = `
    mutation CreateActivity($input:ScheduleInput!){
        createActivity(input:$input){
            id
            title
            type
            day
            duration
            userId
        }
    }
`

const deleteActivityMutation = `
    mutation DeleteActivity($id:Int!){
        deleteActivity(id:$id)
    }
`

const activitiesByUserQuery = `
    query ActivitiesByUser{
        activitiesByUser{
            activities{
                id
                title
                type
                day
                duration
            }
        }
    }
`

describe("CreateScheduleActivity", () => {
    it("creates a new schedule activity", async () => {
        const response = await graphqlCall({
            source: createActivityMutation,
            variableValues: {
                input: {
                    title: "test title",
                    type: "test type",
                    day: "Monday",
                    duration: 20
                }
            }
        })

        expect(response).toMatchObject({
            data: {
                createActivity: {
                    title: "test title",
                    type: "test type",
                    day: "Monday",
                    duration: 20,
                    userId: 1
                }
            }
        })

        const scheduleEntry = await Schedule.findOne({where: {title: "test title"}})
        expect(scheduleEntry).toBeDefined()
    })
})

describe("DeleteScheduleActivity", () => {
    it("delete a schedule activity by given id", async () => {
        const response = await graphqlCall({
            source: deleteActivityMutation, 
            variableValues: {
                id: 1
            }
        })

        expect(response).toMatchObject({
            data: {
                deleteActivity: true
            }
        })

        const checkIfDeleted = await Schedule.findOne({where: {id: 1}})
        expect(checkIfDeleted).toBeFalsy()
    })
})

describe("ActivitiesByUser", () => {
    it("queries and finds all activities for currently logged in user", async () => {
        const response = await graphqlCall({
            source: activitiesByUserQuery,
        })

        expect(response).toMatchObject({
            data: {
                activitiesByUser: {
                    activities: [
                        {
                            title: "test title",
                            type: "test type",
                            day: "Monday",
                            duration: 20,
                        }
                    ]
                }
            }
        })
    })
})