import {Router, Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {ioc} from "../IoCContainer";

const base64 = require('base-64');


export const authRouter = Router({})

authRouter.post('/login',
  async (req: Request, res: Response) => {
    const user = await ioc.usersService.checkCredentials(req.body.login, req.body.password)
    if (user !== null) {
      const token = await jwtService.createJWT(user)
      res.send({
        "token": token
      })
    } else {
      res.sendStatus(401)
    }
  })
authRouter.post('/confirm-email',
  async (req: Request, res: Response) => {
    // const user = await ioc.usersService.createUser(req.body.login, req.body.password)
    // if (user !== null) {
    //   const token = await jwtService.createJWT(user)
    //   res.send({
    //     "token": token
    //   })
    // } else {
    //   res.sendStatus(401)
    // }
  })
authRouter.post('/resend-registration-code',
  async (req: Request, res: Response) => {
    // const user = await ioc.usersService.createUser(req.body.login, req.body.password)
    // if (user !== null) {
    //   const token = await jwtService.createJWT(user)
    //   res.send({
    //     "token": token
    //   })
    // } else {
    //   res.sendStatus(401)
    // }
  })

export const authCheckUserAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(401)
    return
  }

  const token = req.headers.authorization.split(' ')[1] // "bearer jdgjkad.jajgdj.jksadgj"
  const userId = await jwtService.getUserIdByToken(token)
  if (userId) {
    req.user = await ioc.usersService.findUser(userId)
    next()
    return
  }
  res.sendStatus(401)
  return
}

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