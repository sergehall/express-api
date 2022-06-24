import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {UserDBType, UserObjectId} from "../types/all_types";

const ck = require('ckey')

export const jwtService = {
  async createJWT(user: UserDBType) {
    return jwt.sign({userId: user._id}, ck.JWT_SECRET, {expiresIn: '1h'})
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

export const jwtServiceUsersAccount = {
  async createJWT(userObjectId: UserObjectId) {
    return jwt.sign({userId: userObjectId._id}, ck.JWT_SECRET, {expiresIn: '1h'})
  }
}
