import { testConnection } from "../testutils/testConnection";
import { Connection } from "typeorm";
import { graphqlCall } from "../testutils/graphqlCall";
import { WeightHistory } from "../entities/weightHistoryEntity";

let con: Connection;

beforeAll(async () => {
    con = await testConnection()
})

afterAll(async () => {
    await con.close()
})

const createWeightEntryMutation = `
    mutation CreateWeightEntry($weight:Float!){
        createWeightEntry(weight:$weight){
            id
            weight
            userId
        }
    }
`

const getWeightHistoryByUserMutation = `

`

describe("CreateWeightEntry", () => {
    it("creates a new entry in users weight history", async () => {
        const response = await graphqlCall({
            source: createWeightEntryMutation,
            variableValues: {
                weight: 55
            }
        })

        expect(response).toMatchObject({
            data: {
                createWeightEntry: {
                    id: 1,
                    weight: 55,
                    userId: 1
                }
            }
        })

        const weight = await WeightHistory.findOne({where: {userId: 1}})
        expect(weight).toBeDefined()
    })
})

describe("GetWeightHistory", () => {
    it("gets weight history for currently logged in user", async () => {
        const response = await graphqlCall({
            source: getWeightHistoryByUserMutation,
        })

        expect(response).toMatchObject({
            data: {
                getWeightHistoryByUser: {
                    weightHistory: [
                        {
                            id: 1,
                            weight: 55,
                            createdAt: "1643729900438"
                        }
                    ]
                }
            }
        })
    })
})