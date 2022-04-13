import {createConnection} from 'typeorm'
import path from 'path'
import 'dotenv-safe/config';
import express from 'express';
import connectRedis from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';
import cors from 'cors';
import { prod } from './constants';
import { ApolloServer } from 'apollo-server-express';
import { User } from './entities/userEntity';
import { SavedFood } from './entities/savedFoodEntity';
import { SavedWorkout } from './entities/savedWorkoutEntity';
import { FoodDiary } from './entities/foodDiaryEntity';
import { WorkoutDiary } from './entities/workoutDiaryEntity';
import { Schedule } from './entities/scheduleEntity';
import { WeightHistory } from './entities/weightHistoryEntity';
import { foodLoader } from './utils/foodLoader';
import { workoutLoader } from './utils/workoutLoader';
import { Group } from './entities/groupEntity';
import { GroupMembers } from './entities/groupMembersEntity';
import { GroupActivity } from './entities/groupActivityEntity';
import { GroupInvites } from './entities/groupInvitesEntity';
import { workoutDiaryLoader } from './utils/workoutDiaryLoader';
import { foodDiaryLoader } from './utils/foodDiaryLoader';
import { weightHistoryLoader } from './utils/weightHistoryLoader';
import { userLoader } from './utils/userLoader';
import { createSchema } from './utils/createSchema';
import { groupLoader } from './utils/groupLoader';

const main = async () => {

    const db = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: false,
        // synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [
            User,
            SavedFood,
            SavedWorkout,
            FoodDiary,
            WorkoutDiary,
            Schedule,
            WeightHistory,
            Group,
            GroupMembers,
            GroupActivity,
            GroupInvites
        ]
    })

    await db.runMigrations();

    const app = express()

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);
    app.set("trust proxy", 1)
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true
        })
    )

    app.use(
        session({
            name: "FYPCOOKIE",
            store: new RedisStore({client: redis, disableTouch: true}),
            cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                    httpOnly: true,
                    secure: prod,
                    sameSite: 'lax',
                    domain: prod ? ".supercrumble.com" : undefined
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false
        })
    )

    const schema = await createSchema()

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}) => ({ 
            req, 
            res, 
            redis, 
            foodLoader: foodLoader(),
            workoutLoader: workoutLoader(),
            workoutDiaryLoader: workoutDiaryLoader(),
            foodDiaryLoader: foodDiaryLoader(),
            weightHistoryLoader: weightHistoryLoader(),
            userLoader: userLoader(),
            groupLoader: groupLoader()
        }),
        introspection: true
    })

    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: false})

    app.listen(parseInt(process.env.PORT), () => {
        console.log("Server has started on localhost:" + process.env.PORT)
    })
}

main().catch(err => {
    console.error(err)
})