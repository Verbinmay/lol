import { UserDBModel } from "../types";

declare global {
    declare namespace Express {
        export interface Request {
            user: ObjectId<UserDBModel> | null
        }
    }
}