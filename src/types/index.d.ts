import {UserType} from "src/types/tsTypes.ts";

declare global {
  declare namespace Express {
    export interface Request {
      user: UserType | null
    }
  }
}