import {NextFunction, Request, Response} from "express";
import bcrypt from "bcrypt";
import requestIp from "request-ip";
import {ioc} from "../IoCContainer";
import {UserType} from "../types/types";

const base64 = require('base-64');


export class Auth {

  async authenticationAccessToken(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      res.sendStatus(401)
      return
    }
    const token = req.headers.authorization.split(' ')[1] // "bearer jdgjkad.jajgdj.jksadgj"
    const userId = await ioc.jwtService.verifyAccessJWT(token)
    if (!userId) {
      return res.sendStatus(401)

    }
    req.user = await ioc.usersService.findUserByUserId(userId)
    next()
  }

  async noneStatusRefreshToken(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies.refreshToken) {
      next()
      return
    }

    const userId = await ioc.jwtService.verifyRefreshJWT(req.cookies.refreshToken)
    if (!userId) {
      next()
      return
    }
    req.user = await ioc.usersService.findUserByUserId(userId)
    next()
    return
  }

  async noneStatusAccessToken(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next()
      return
    }
    const userId = await ioc.jwtService.verifyAccessJWT(req.headers.authorization.split(" ")[1])
    if (!userId) {
      next()
      return
    }
    req.user = await ioc.usersService.findUserByUserId(userId)
    next()
    return
  }

  async basicAuthorization(req: Request, res: Response, next: NextFunction) {
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

  async checkoutContentType(req: Request, res: Response, next: NextFunction) {
    if (req.headers['content-type'] === 'application/json') {
      next()
      return
    }
    res.status(400).send('Bad content type')
    return
  }

  async checkCredentialsLoginPass(req: Request, res: Response, next: NextFunction) {
    const user: UserType | null = await ioc.usersService.findUserByLoginOrEmail(req.body.loginOrEmail)
    if (user) {
      const compare = await bcrypt.compare(req.body.password, user.accountData.passwordHash)
      if (compare) {
        req.headers.userId = `${user.accountData.id}`
        next()
        return
      }
    }
    return res.status(401).send({
      errorsMessages: [
        {
          message: "loginOrEmail or password is wrong!",
          field: "loginOrEmail or Password"
        }
      ]
    })
  }


  async checkUserAccountNotExists(req: Request, res: Response, next: NextFunction) {
    const checkOutEmailInDB = await ioc.usersService.findByLoginAndEmail(req.body.email, req.body.login);
    if (!checkOutEmailInDB) {
      next()
      return
    }
    res.status(400).send({
      errorsMessages: [{
        message: "Account already exist.",
        field: "login, email"
      }]
    });
    return

  }

  async checkIpInBlackList(req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    if (clientIp) {
      const result = await ioc.blackListIPRepository.checkoutIPinBlackList(clientIp);
      if (!result) {
        return next()
      }
      return res.status(403).send(`IP:  ${clientIp} in black list`) // need thinks
    }
  }

  async compareCurrentAndCreatorComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user
      if (!user) {
        res.sendStatus(404)
        return
      }
      const userLogin = user.accountData.login
      const userId = user.accountData.id
      const commentId = req.params.commentId;

      const foundPostWithComments = await ioc.commentsService.findCommentCompareOwner(commentId)

      if (foundPostWithComments) {
        if (foundPostWithComments.userId === userId && foundPostWithComments.userLogin === userLogin) {
          next()
          return
        }
        res.sendStatus(403)
        return
      }
      res.sendStatus(404)
      return

    } catch (e) {
      console.log(e)
      res.sendStatus(401)
      return
    }
  }

}