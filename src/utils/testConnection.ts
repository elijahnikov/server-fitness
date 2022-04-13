import { createConnection } from "typeorm"

export const testConnection = async () => 
{
    createConnection({
        type: 'postgres',
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "testfitness",
        synchronize: true,
        dropSchema: true,
        logging: false,
        entities: ["src/entities/**/*"]
    })
}