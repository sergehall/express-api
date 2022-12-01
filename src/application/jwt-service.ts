import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken'
import uuid4 from "uuid4";
import {BlackListRefreshTokenJWT, DTOJWT, PayloadType} from "../types/tsTypes";
import jwt_decode from "jwt-decode";
import {inject, injectable} from "inversify";
import {
  BlackListRefreshTokenJWTRepository
} from "../repositories/blackListRefreshTokenJWT-db-repository";
import {TYPES} from "../types/types";


const ck = require('ckey')

@injectable()
export class JWTService {

  constructor(@inject(TYPES.BlackListRefreshTokenJWTRepository) protected blackListRefreshTokenJWTRepository: BlackListRefreshTokenJWTRepository) {
  }

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
        await this.blackListRefreshTokenJWTRepository.findJWT(refreshToken)
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

  async jwt_decode(token: string): Promise<PayloadType> {
    return jwt_decode(token)
  }

  async addJWTInBlackList(refreshToken: string): Promise<BlackListRefreshTokenJWT | null> {
    const payload: PayloadType = jwt_decode(refreshToken)
    async function generateString(numCh: number) {
      let result = '';
      const charactersLength = refreshToken.length;
      for (let i = 0; i < numCh; i++) {
        result += refreshToken.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    const dtoJWTToDB: DTOJWT = {
      refreshToken: refreshToken.slice(ck.NUM1, ck.NUM2) + await generateString(ck.NUM3),
      expirationDate: new Date(payload.exp * 1000).toISOString()
    }

    return  await this.blackListRefreshTokenJWTRepository.addJWT(dtoJWTToDB)
  }

}

