import jwt from 'jsonwebtoken'
import {NextFunction, Request, Response} from "express";
import {ioc} from "../IoCContainer";

const ck = require('ckey')

export const jwtService = {

  async createUsersAccountJWT(userId: string) {
    return jwt.sign({userId: userId}, ck.ACCESS_SECRET_KEY, {expiresIn: '30m'})
  }, // 10s

  async createUsersAccountRefreshJWT(userId: string) {
    return jwt.sign({userId: userId}, ck.REFRESH_SECRET_KEY, {expiresIn: '30s'})
  },

  async verifyRefreshJWT(token: string) {
    try {
      const result: any = jwt.verify(token, ck.REFRESH_SECRET_KEY)
      return result.userId
    } catch (e) {
      return null
    }
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, ck.ACCESS_SECRET_KEY)
      return result.userId
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

