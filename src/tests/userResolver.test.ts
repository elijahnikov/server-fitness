import { graphqlCall } from "../testutils/graphqlCall";
import { Connection } from "typeorm"
import { testConnection } from "../testutils/testConnection"
import { User } from "../entities/userEntity";

let con: Connection;

beforeAll(async () => {
    con = await testConnection()
})

afterAll(async () => {
    await con.close()
})

const registerMutation = `
    mutation Register($password: String!, $username: String!, $email:String!)
    {
        register(
            password:$password,
            username:$username,
            email:$email 
        )
        {
            id
            username
            displayName
            email   
        }
    }
`

const loginMutation = `
    mutation Login($password: String!, $email: String!)
    {
        login(
            password:$password,
            email:$email
        )
        {
            id
            username
            displayName
            email    
        }
    }
`

describe("Register", () => {
    it("creates a user with given username/password/email", async () => {
        const response = await graphqlCall({
            source: registerMutation,
            variableValues: {
                password: "dsfsdfa",
                username: "testUsername",
                email: "testemail@test.com"
            }
        })

        expect(response).toMatchObject({
            data: { 
                register: {
                    username: "testUsername",
                    email: "testemail@test.com",
                    displayName: null
                }
            }
        })

        const user = await User.findOne({where: {email: "testemail@test.com"}})
        expect(user).toBeDefined()
    })
})

describe("Login", () => {
    it("logs the user in with their provided email and password", async () => {
        const response = await graphqlCall({
            source: loginMutation,
            variableValues: {
                password: "dsfsdfa",
                email: "testemail@test.com"
            }
        })
        
        expect(response).toMatchObject({
            data: {
                login: {
                    username: "testUsername",
                    displayName: null,
                    email: "testemail@test.com"
                }
            }
        })
    })
})