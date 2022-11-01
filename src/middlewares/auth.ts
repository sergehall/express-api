import {NextFunction, Request, Response} from "express";
import {ioc} from "../IoCContainer";
import bcrypt from "bcrypt";
import requestIp from "request-ip";

const base64 = require('base-64');


export class Auth {

  async authentication(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      res.sendStatus(401)
      return
    }
    const token = req.headers.authorization.split(' ')[1] // "bearer jdgjkad.jajgdj.jksadgj"
    const userId = await ioc.jwtService.verifyAccessJWT(token)
    if (!userId) {
      res.sendStatus(401)
      return
    }
    req.user = await ioc.usersAccountService.findUserByUserId(userId)
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
    req.user = await ioc.usersAccountService.findUserByUserId(userId)
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
    const user = await ioc.usersAccountService.findUserByLoginOrEmail(req.body.login)
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
          message: "Login or password is wrong!",
          field: "Login or Password"
        }
      ]
    })
  }


  async checkUserAccountNotExists(req: Request, res: Response, next: NextFunction) {
    const checkOutEmailInDB = await ioc.usersAccountService.findByLoginAndEmail(req.body.email, req.body.login);
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
      if (result === null) {
        return res.status(400).send('Black list IP1') // need thinks
      }
      next()
      return
    }
    return res.status(400).send('Bad IP2'); // need thinks
  }

  async compareCurrentAndCreatorComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userLogin = req.user.accountData.login
      const userId = req.user.accountData.id
      const commentId = req.params.commentId;
      const filter = {"allComments.id": commentId}

      const foundPostWithComments = await ioc.commentsService.findCommentInDB(filter)

      if (foundPostWithComments) {
        const postWithComments = foundPostWithComments.allComments.filter(i => i.id === commentId)[0]
        if (postWithComments.userId === userId && postWithComments.userLogin === userLogin) {
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