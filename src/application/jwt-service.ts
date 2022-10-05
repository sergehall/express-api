import jwt from 'jsonwebtoken'
import {UserObjectId} from "../types/all_types";
import {NextFunction, Request, Response} from "express";
import {ioc} from "../IoCContainer";

const ck = require('ckey')

export const jwtService = {

  async createUsersAccountJWT(userObjectId: UserObjectId) {
    return jwt.sign({userId: userObjectId}, ck.ACCESS_SECRET_KEY, {expiresIn: '30m'})
  }, // 10s

  async createUsersAccountRefreshJWT(userObjectId: UserObjectId) {
    return jwt.sign({userId: userObjectId}, ck.REFRESH_SECRET_KEY, {expiresIn: '30s'})
  },

  async verifyRefreshJWT(token: string) {
    try {
      const result: any = jwt.verify(token, ck.REFRESH_SECRET_KEY)
      return result.userId.id
    } catch (e) {
      return null
    }
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, ck.ACCESS_SECRET_KEY)
      return result.userId.id
    } catch (err) {
      return null
    }
  },

  async checkRefreshTokenInBlackListAndVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken
      const tokenInBlackList = await ioc.blackListRefreshTokenJWTRepository.findByRefreshTokenAndUserId(token)
      const userId: string | null = await jwtService.verifyRefreshJWT(token);
      if (tokenInBlackList || userId === null) {
        return res.sendStatus(401)
      }
      next()
      return
    } catch (e) {
      console.log(e, "CheckRefreshTokenInBlackList")
      return res.sendStatus(401)
    }
  }
}

