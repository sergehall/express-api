import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {ioc} from "../IoCContainer";

const base64 = require('base-64');


export const authMiddlewareBasicAuthorization = (req: Request, res: Response, next: NextFunction) => {
  try {
    const expectedAuthHeaderValue = "Basic " + base64.encode("admin:qwerty")

    if (req.headers.authorization !== expectedAuthHeaderValue) {
      return res.sendStatus(401)
    }
    next();
  } catch (e) {
    res.sendStatus(401)
  }
}

export const authCheckUserAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(401)
    return
  }

  const token = req.headers.authorization.split(' ')[1] // "bearer jdgjkad.jajgdj.jksadgj"
  const userId = await jwtService.getUserIdByToken(token)
  if (userId === null) {
    res.sendStatus(401)
    return
  }
  req.user = await ioc.usersService.findUser(userId)
  next()
  return
}
export const authCheckUserAuthorizationForUserAccount = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(401)
    return
  }

  const token = req.headers.authorization.split(' ')[1] // "bearer jdgjkad.jajgdj.jksadgj"
  const userId = await jwtService.getUserIdByToken(token)
  if (userId === null) {
    res.sendStatus(401)
    return
  }
  req.user = await ioc.usersAccountService.findUserByObjectId(userId)
  next()
  return
}