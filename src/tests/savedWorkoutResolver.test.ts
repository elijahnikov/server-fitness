import { testConnection } from "../testutils/testConnection";
import { Connection } from "typeorm";
import { graphqlCall } from "../testutils/graphqlCall";
import { SavedWorkout } from "../entities/savedWorkoutEntity";

let con: Connection;

beforeAll(async () => {
    con = await testConnection()
})

afterAll(async () => {
    await con.close( )
})

const createSavedWorkoutMutation = `
    mutation CreateSavedWorkout($input:SavedWorkoutInput!){
        createSavedWorkout(input:$input){
            id
            title
            type
            sets
            reps
            weight
            duration
            userId
        }
    }
`

const savedWorkoutByUserQuery = `
    query SavedWorkoutByUser($type:String){
        savedWorkoutByUser(type:$type){
            savedWorkouts{
                id
                title
                type
                sets
                reps
                weight
                duration
                userId
            }
        }
    }
`

describe("CreateSavedWorkout", () => {
    it("creates a new saved workout", async () => {
        const response = await graphqlCall({
            source: createSavedWorkoutMutation,
            variableValues: {
                input: {
                    title: "test workout",
                    type: "Strength",
                    sets: "4",
                    reps: "8-12",
                    weight: 20,
                    duration: null
                }
            }
        })

        expect(response).toMatchObject({
            data: {
                createSavedWorkout: {
                    title: "test workout",
                    type: "Strength",
                    sets: "4",
                    reps: "8-12",
                    weight: 20,
                    duration: null 
                }
            }
        })

        const savedWorkout = await SavedWorkout.findOne({where: {title: "test workout"}})
        expect(savedWorkout).toBeDefined()
    })
})

describe("SavedWorkoutByUser", () => {
    it("queries and finds saved workouts by user", async () => {
        const response = await graphqlCall({
            source: savedWorkoutByUserQuery,
            variableValues: {
                type: "Strength"
            }
        })

        expect(response).toMatchObject({
            data: {
                savedWorkoutByUser: {
                    savedWorkouts: {
                        id: 1,
                        title: "test workout",
                        type: "Strength",
                        sets: "4",
                        reps: "8-12",
                        weight: 20,
                        duration: null,
                        userId: 1
                    }
                }
            }
        })
    })

})