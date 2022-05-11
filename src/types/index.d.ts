import {UserDBType} from "../repositories/db";

declare global {
  declare namespace Express {
    export interface Request {
      user: UserDBType | null
    }
  }
}