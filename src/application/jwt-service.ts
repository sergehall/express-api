import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {UserDBType} from "../types/all_types";

const ck = require('ckey')

export const jwtService = {
  async createJWT(user: UserDBType) {
    return jwt.sign({userId: user._id}, ck.JWT_SECRET, {expiresIn: '1h'})
    // return {
    //   resultCode: 0,
    //   data: {
    //     token: token
    //   }
    // }
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, ck.JWT_SECRET)
      return new ObjectId(result.userId)
    } catch (err) {
      return null
    }
  }
}
