import { testConnection } from "../testutils/testConnection";
import { Connection } from "typeorm";
import { graphqlCall } from "../testutils/graphqlCall";
import { SavedFood } from "../entities/savedFoodEntity";

let con: Connection;

beforeAll(async () => {
    con = await testConnection()
})

afterAll(async () => {
    await con.close()
})

const createSavedFoodMutation = `
    mutation CreateSavedFood($input:SavedFoodInput!){
        createSavedFood(input:$input){
            id
            title
            serving
            calories
            protein
            carbs
            fat
            type
            userId
        }
    }
`

const savedFoodByUserQuery = `
    query SavedFoodByUser($type:String){
        savedFoodByUser(type:$type){
            savedFoods{
                id
                title
                serving
                calories
                protein
                carbs
                fat
                type
            }
        }
    }
`
describe("CreateSavedFood", () => {
    it("Creates a new saved food", async () => {
        const response = await graphqlCall({
            source: createSavedFoodMutation,
            variableValues: {
                input: {
                    title: "test food",
                    serving: 1,
                    calories: 100,
                    protein: 20,
                    carbs: 20,
                    fat: 20,
                    type: "Test"
                }
            }
        })

        expect(response).toMatchObject({
            data: {
                createSavedFood: {
                    title: "test food",
                    serving: 1,
                    calories: 100,
                    protein: 20,
                    carbs: 20,
                    fat: 20,
                    type: "Test",
                    userId: 1
                }
            }
        })

        const savedFood = await SavedFood.findOne({where: {title: "test food"}})
        expect(savedFood).toBeDefined()
    })
})

describe("SavedFoodByUser", () => {
    it("queries and finds saved food by user", async () => {
        const response = await graphqlCall({
            source: savedFoodByUserQuery,
            variableValues: {
                type: ""
            }
        })

        expect(response).toMatchObject({
            data: {
                savedFoodByUser: {
                    savedFoods: [
                        {
                            id: 2,
                            title: "test food"
                        }
                    ]
                }
            }
        })
    })
})