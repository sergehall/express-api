import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {ioc} from "../IoCContainer";

export class AuthCheckUserAuthorizationForUserAccount {
  async authCheck(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      res.sendStatus(401)
      return
    }
    const token = req.headers.authorization.split(' ')[1] // "bearer jdgjkad.jajgdj.jksadgj"
    const userId = await jwtService.getUserIdByToken(token)
    if (!userId) {
      res.sendStatus(401)
      return
    }
    req.user = await ioc.usersAccountService.findUserByUserId(userId)
    next()
  }

  async noneStatus(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next()
      return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId === null) {
      next()
      return
    }
    req.user = await ioc.usersAccountService.findUserByUserId(userId)
    next()
    return
  }
}