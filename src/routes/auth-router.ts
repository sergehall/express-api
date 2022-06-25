import {Router, Request, Response} from "express";
import {jwtServiceUsersAccount} from "../application/jwt-service";
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
import {checkCredentialsLoginPass} from "../middlewares/checkCredentialsLoginPass";
import {ObjectId} from "mongodb";


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
    if(result === null) {
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
    const token = await jwtServiceUsersAccount.createJWT({_id: new ObjectId(userReqHedObjId)})
    res.status(200).send({
      "token": token
    })
    return
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
      res.status(201).send("Email confirmed by query ?Code=.");
      return
    } else {
      res.sendStatus(400)
      return
    }
  })

authRouter.get('/resend-registration-email/',
  checkHowManyTimesUserLoginLast10secWithSameIpRegEmailRes,
  async (req: Request, res: Response) => {
    const parseQueryData = parseQuery(req)
    const code = parseQueryData.code
    console.log(code, "code")
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

authRouter.delete('/logout',
  async (req: Request, res: Response) => {
    const result = await ioc.usersAccountService.deleteUserWithRottenCreatedAt()
    res.send(`Total, did not confirm registration user were deleted = ${result}`)
  })


// for usersService
// authRouter.post('/login',
//   async (req: Request, res: Response) => {
//     const user = await ioc.usersService.checkCredentials(req.body.login, req.body.password)
//     if (user !== null) {
//       const token = await jwtService.createJWT(user)
//       res.send({
//         "token": token
//       })
//     } else {
//       res.sendStatus(401)
//     }
//   })

