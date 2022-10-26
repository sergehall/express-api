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

    const userId = await ioc.jwtService.verifyRefreshJWT(req.cookies.refreshToken.toString())
    if (userId === null) {
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
    const user = await ioc.auth.checkCredentials(req.body.login, req.body.password)
    if (user === null) {
      res.status(401).send({
        "errorsMessages": [
          {
            message: "Login or password is wrong!",
            field: "Login or Password"
          }
        ]
      })
      return
    }
    req.headers.foundId = `${user.accountData.id}`
    next()
  }

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await ioc.usersAccountService.findByLoginOrEmail(loginOrEmail)
    if (!user) {
      return null
    }
    const compare = await bcrypt.compare(password, user.accountData.passwordHash)
    if (compare) {
      return user
    }
    //user.accountData.passwordHash === passwordHash; // true or false if not match
    return null
  }

  async checkUserAccountNotExists(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const login = req.body.login;
    let errorMessage = {};
    if (email || login) {
      const checkOutEmailInDB = await ioc.usersAccountService.findByLoginAndEmail(email, login);
      if (checkOutEmailInDB === null) {
        next()
        return
      }
      if (checkOutEmailInDB.accountData.email === email) {
        errorMessage = {
          message: "Email already exist.",
          field: "email"
        }
      }
      if (checkOutEmailInDB.accountData.login === login) {
        errorMessage = {
          message: "Login already exist",
          field: "login"
        }
      }
      res.status(400).send({
        errorsMessages: [errorMessage]
      });
      return
    }
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