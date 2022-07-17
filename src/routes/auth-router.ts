import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {ioc} from "../IoCContainer";
import requestIp from 'request-ip';
import {checkoutIPFromBlackList} from "../middlewares/middleware-checkoutIPFromBlackList";
import {checkoutContentType} from "../middlewares/checkout-contentType";
import {
  bodyCode,
  bodyEmail,
  bodyLogin, bodyLoginUsersAccount,
  bodyPassword, bodyPasswordUsersAccount,
  inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";
import {
  checkHowManyTimesUserLoginLast10secWithSameIpLog,
  checkHowManyTimesUserLoginLast10secWithSameIpReg,
  checkHowManyTimesUserLoginLast10secWithSameIpRegConf,
  checkHowManyTimesUserLoginLast10secWithSameIpRegEmailRes
} from "../middlewares/checkHowManyTimesUserLoginLast10secWithSameIp";
import {checkOutEmailOrLoginInDB} from "../middlewares/checkOutEmailInDB";
import {parseQuery} from "../middlewares/parse-query";
import {ObjectId} from "mongodb";
import jwt_decode from "jwt-decode";
import {payloadType} from "../types/all_types";
import {
  authCheckUserAuthorizationForUserAccount
} from "../middlewares/auth-Basic-User-authorization";
import {checkCredentialsLoginPass} from "../middlewares/checkCredentialsLoginPass";


export const authRouter = Router({})

authRouter.post('/registration-confirmation',
  checkoutIPFromBlackList,
  bodyCode, inputValidatorMiddleware,
  checkHowManyTimesUserLoginLast10secWithSameIpRegConf,
  async (req: Request, res: Response) => {
    const clientIp = requestIp.getClientIp(req);
    const countItWithIsConnectedFalse = await ioc.usersAccountService.checkHowManyTimesUserLoginLastHourSentEmail(clientIp)
    if (countItWithIsConnectedFalse > 5) {
      res.status(429).send('More than 5 emails sent.')
      return
    }
    const result = await ioc.usersAccountService.confirmByCodeInParams(req.body.code)
    if (result === null) {
      res.status(400).send({
        "errorsMessages": [
          {
            message: "That code is not correct or account already confirmed",
            field: "code"
          }
        ]
      })
      return
    }
    res.sendStatus(204)
    return
  });

authRouter.post('/registration',
  checkoutIPFromBlackList,
  checkoutContentType,
  bodyLogin, bodyPassword, bodyEmail, inputValidatorMiddleware,
  checkOutEmailOrLoginInDB,
  checkHowManyTimesUserLoginLast10secWithSameIpReg,
  async (req: Request, res: Response) => {
    const clientIp = requestIp.getClientIp(req);
    const countItWithIsConnectedFalse = await ioc.usersAccountService.checkHowManyTimesUserLoginLastHourSentEmail(clientIp)
    if (countItWithIsConnectedFalse > 5) {
      res.status(403).send('5 emails were sent to confirm the code.')
      return
    }
    const user = await ioc.usersAccountService.createUserRegistration(req.body.login, req.body.email, req.body.password, clientIp);
    if (user) {
      res.sendStatus(204);
      return
    }
    res.status(400).send({
      "errorsMessages": [
        {
          message: "Error with authRouter.post('/registration'......",
          field: "some"
        }
      ]
    });
    return
  });

authRouter.post('/registration-email-resending',
  bodyEmail, inputValidatorMiddleware,
  checkHowManyTimesUserLoginLast10secWithSameIpRegEmailRes,
  async (req: Request, res: Response) => {
    const email: string = req.body.email
    const userResult = await ioc.usersAccountService.updateAndSentConfirmationCodeByEmail(email)
    if (userResult === null) {
      res.status(400).send({
        "errorsMessages": [
          {
            "message": "Check the entered email or isConfirmed already true.",
            "field": "email"
          }
        ]
      });
      return
    }
    console.log(`Resend code to email:  ${userResult?.accountData?.email}`);
    res.sendStatus(204)
    return
  });

authRouter.post('/login',
  bodyLoginUsersAccount, bodyPasswordUsersAccount, inputValidatorMiddleware,
  checkHowManyTimesUserLoginLast10secWithSameIpLog,
  checkCredentialsLoginPass,
  async (req: Request, res: Response) => {
    const userReqHedObjId = (req.headers.foundId) ? `${req.headers.foundId}` : '';
    console.log("login-----", req.body.login, req.body.email, userReqHedObjId)
    const accessToken = await jwtService.createUsersAccountJWT({_id: new ObjectId(userReqHedObjId)})
    console.log("accessToken", accessToken)
    const refreshToken = await jwtService.createUsersAccountRefreshJWT({_id: new ObjectId(userReqHedObjId)})
    console.log("refreshToken", refreshToken)
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
    // res.cookie("refreshToken", refreshToken, {httpOnly: true})
    console.log("accessToken refreshToken --------")
    return res.status(200).send({
      "accessToken": accessToken
    })
  })

authRouter.post('/refresh-token',
  jwtService.checkRefreshTokenInBlackListAndVerify,
  async (req: Request, res: Response) => {
    try {
      const payload: payloadType = jwt_decode(req.cookies.refreshToken);
      const accessToken = await jwtService.createUsersAccountJWT({_id: new ObjectId(payload.userId)})
      const refreshToken = await jwtService.createUsersAccountRefreshJWT({_id: new ObjectId(payload.userId)})
      res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
      // res.cookie("refreshToken", refreshToken, {httpOnly: true})
      res.status(200).send({accessToken: accessToken})
      return

    } catch (e) {
      console.log(e)
      return res.status(401).send({error: e})
    }

  })

authRouter.post('/logout',
  jwtService.checkRefreshTokenInBlackListAndVerify,
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const insertToken = await ioc.blackListRefreshTokenJWTRepository.addRefreshTokenAndUserId(refreshToken)
    return res.sendStatus(204)
  })

authRouter.get("/me",
  authCheckUserAuthorizationForUserAccount,
  async (req: Request, res: Response) => {
    const user = req.user
    if (user) {
      return res.status(200).send({
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user.accountData.id

      })
    }
    return res.sendStatus(401)
  })

authRouter.get('/resend-registration-email/',
  checkHowManyTimesUserLoginLast10secWithSameIpRegEmailRes,
  async (req: Request, res: Response) => {
    const parseQueryData = parseQuery(req)
    const code = parseQueryData.code
    if (code === null) {
      res.status(400).send("Query param is empty")
      return
    }
    const user = await ioc.usersAccountService.findByConfirmationCode(code)
    if (user === null) {
      res.status(400).send("Bad code or isConfirmed is true.")
      return
    }
    const result = await ioc.usersAccountService.updateAndSentConfirmationCodeByEmail(user.accountData.email)
    res.send(`Resend code to email:  ${result?.accountData?.email}`)
  })

authRouter.get('/confirm-registration',
  async (req: Request, res: Response) => {
    const parseQueryData = parseQuery(req)
    const code = parseQueryData.code
    if (code === null) {
      res.sendStatus(400)
      return
    }
    const result = await ioc.usersAccountService.confirmByCodeInParams(code)
    if (result && result.emailConfirmation.isConfirmed) {
      res.status(201).send("Email confirmed by query ?code=...");
      return
    } else {
      res.sendStatus(400)
      return
    }
  })

authRouter.post('/confirm-email',
  async (req: Request, res: Response) => {
    const result = await ioc.usersAccountService.confirmByEmail(req.body.confirmationCode, req.body.email)
    if (result !== null) {
      res.status(201).send("Email confirmed by email and confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.get('/confirm-code/:code',
  async (req: Request, res: Response) => {
    const result = await ioc.usersAccountService.confirmByCodeInParams(req.params.code)
    if (result && result.emailConfirmation.isConfirmed) {
      res.status(201).send("Email confirmed by params confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.delete('/logoutRottenCreatedAt',
  async (req: Request, res: Response) => {
    const result = await ioc.usersAccountService.deleteUserWithRottenCreatedAt()
    res.send(`Total, did not confirm registration user were deleted = ${result}`)
  })


