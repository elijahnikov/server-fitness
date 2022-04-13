import { Session, SessionData } from "express-session";
import {Request, Response} from 'express';
import { Redis } from "ioredis";
import { foodLoader } from "./utils/foodLoader";
import { workoutLoader } from "./utils/workoutLoader";
import { workoutDiaryLoader } from "./utils/workoutDiaryLoader";
import { foodDiaryLoader } from "./utils/foodDiaryLoader";
import { weightHistoryLoader } from "./utils/weightHistoryLoader";
import { userLoader } from "./utils/userLoader";
import { groupLoader } from "./utils/groupLoader";

export type _Context = {

    req: Request & {session: Session & Partial<SessionData>&{userId?: number}};
    res: Response;
    redis: Redis;
    foodLoader: ReturnType<typeof foodLoader>
    workoutLoader: ReturnType<typeof workoutLoader>
    workoutDiaryLoader: ReturnType<typeof workoutDiaryLoader>
    foodDiaryLoader: ReturnType<typeof foodDiaryLoader>
    weightHistoryLoader: ReturnType<typeof weightHistoryLoader>
    userLoader: ReturnType<typeof userLoader>
    groupLoader: ReturnType<typeof groupLoader>
}
