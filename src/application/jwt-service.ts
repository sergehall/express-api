import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken'
import {ioc} from "../IoCContainer";
import uuid4 from "uuid4";
import {PayloadType} from "../types/all_types";

const ck = require('ckey')

export const jwtService = {

  async createUsersAccountJWT(userId: string) {
    const deviceId = uuid4().toString();
    return jwt.sign({userId: userId, deviceId}, ck.ACCESS_SECRET_KEY, {expiresIn: '10s'})
  },

  async createUsersAccountRefreshJWT(userId: string) {
    const deviceId = uuid4().toString();
    return jwt.sign({userId: userId, deviceId}, ck.REFRESH_SECRET_KEY, {expiresIn: '20m'})
  }, //20s

  async updateUsersAccountAccessJWT(payload: PayloadType) {
    return jwt.sign({
      userId: payload.userId,
      deviceId: payload.deviceId
    }, ck.ACCESS_SECRET_KEY, {expiresIn: '10s'})
  },


  async updateUsersAccountRefreshJWT(payload: PayloadType) {
    return jwt.sign({
      userId: payload.userId,
      deviceId: payload.deviceId
    }, ck.REFRESH_SECRET_KEY, {expiresIn: '20s'})
  }, //20s

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
      const refreshToken = req.cookies.refreshToken
      const tokenInBlackList = await ioc.blackListRefreshTokenJWTRepository.findByRefreshTokenAndUserId(refreshToken)
      const userId: string | null = await jwtService.verifyRefreshJWT(refreshToken);
      if (tokenInBlackList || !userId) {
        return res.sendStatus(401)
      }
      next()
      return
    } catch (e) {
      console.log(e, "RefreshToken expired or incorrect")
      return res.sendStatus(401)
    }
  }
}

