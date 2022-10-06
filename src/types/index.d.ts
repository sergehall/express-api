import {UserAccountDBType} from "../repositories/db";

declare global {
  declare namespace Express {
    export interface Request {
      user: UserAccountDBType | null
    }
  }
}