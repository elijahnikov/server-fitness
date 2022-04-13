import { graphql, GraphQLSchema } from "graphql"
import { Maybe } from "graphql/jsutils/Maybe"
import { createSchema } from "../utils/createSchema"

interface GraphCallOptions {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>
    userId?: number;
}

let schema: GraphQLSchema

export const graphqlCall = async ({source, variableValues, userId} : GraphCallOptions) => {
    if (!schema) schema = await createSchema()
    return graphql({
        schema: schema,
        source,
        variableValues,
        contextValue: {
            req: {
                session: {
                    userId
                }
            },
            res: {
                clearCookie: jest.fn()
            }
        }
        
    })
}