import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken'
import {ioc} from "../IoCContainer";
import uuid4 from "uuid4";
import {PayloadType} from "../types/types";
import jwt_decode from "jwt-decode";

const ck = require('ckey')

export class JWTService {

  async createAccessJWT(userId: string) {
    const deviceId = uuid4().toString();
    return jwt.sign(
      {userId: userId, deviceId}, ck.ACCESS_SECRET_KEY,
      {expiresIn: ck.EXP_ACC_TIME}
    )
  }

  async createRefreshJWT(userId: string) {
    const deviceId = uuid4().toString();
    return jwt.sign(
      {userId: userId, deviceId}, ck.REFRESH_SECRET_KEY,
      {expiresIn: ck.EXP_REF_TIME}
    )
  }

  async updateAccessJWT(payload: PayloadType) {
    return jwt.sign(
      {userId: payload.userId, deviceId: payload.deviceId}, ck.ACCESS_SECRET_KEY,
      {expiresIn: ck.EXP_ACC_TIME}
    )
  }

  async updateRefreshJWT(payload: PayloadType) {
    return jwt.sign(
      {userId: payload.userId, deviceId: payload.deviceId}, ck.REFRESH_SECRET_KEY,
      {expiresIn: ck.EXP_REF_TIME})
  }

  async verifyRefreshJWT(token: string) {
    try {
      const result: any = jwt.verify(token, ck.REFRESH_SECRET_KEY)
      return result.userId
    } catch (e) {
      return null
    }
  }

  async verifyAccessJWT(token: string) {
    try {
      const result: any = jwt.verify(token, ck.ACCESS_SECRET_KEY)
      return result.userId
    } catch (err) {
      return null
    }
  }

  async verifyRefreshTokenAndCheckInBlackList(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken
      if (
        !refreshToken ||
        !await jwt.verify(refreshToken, ck.REFRESH_SECRET_KEY) ||
        await ioc.blackListRefreshTokenJWTRepository.findJWT(refreshToken)
      ) {
        return res.sendStatus(401)
      }
      next()
      return
    } catch (e: any) {
      console.log("Error:", e.message + ". ")
      return res.sendStatus(401)
    }
  }

  jwt_decode(token: string): PayloadType {
    return jwt_decode(token)
  }
}

