import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {ObjectId} from "mongodb";
import {ioc} from "../IoCContainer";


export const checkRefreshTokenInBlackList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken
    const userId: ObjectId | null = await jwtService.verifyRefreshJWT(token);
    if (!userId) {
      return res.sendStatus(401)
    }
    const tokenInBlackList = await ioc.blackListRefreshTokenJWTRepository.findByRefreshTokenAndUserId(token)
    if (tokenInBlackList) {
      return res.sendStatus(401)
    }
    next()
    return
  }
  catch (e) {
    console.log(e, "CheckRefreshTokenInBlackList")
    return res.sendStatus(401)
  }
}