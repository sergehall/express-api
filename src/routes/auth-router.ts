import {Router, Request, Response} from "express";
import {ioc} from "../IoCContainer";
import requestIp from 'request-ip';
import {
  confirmationCodeValidation,
  emailValidation,
  inputValidatorMiddleware,
  loginOrEmailValidation,
  loginValidation,
  newPasswordValidation,
  passwordValidation,
  recoveryCodeValidation
} from "../middlewares/input-validator-middleware";
import {PayloadType} from "../types/tsTypes";
import {container} from "../Container";
import {JWTService} from "../application/jwt-service";
import {SecurityDevicesService} from "../domain/securityDevices-service";
import {UsersService} from "../domain/users-service";
import {
  BlackListRefreshTokenJWTRepository
} from "../repositories/blackListRefreshTokenJWT-db-repository";
import {ValidateLast10secReq} from "../middlewares/validateLast10secReq";
import {Auth} from "../middlewares/auth";


export const authRouter = Router({})


authRouter.post('/login',
  loginOrEmailValidation,
  passwordValidation,
  inputValidatorMiddleware,
  container.resolve(ValidateLast10secReq).byLogin,
  container.resolve(Auth).checkCredentialsLoginPass,
  async (req: Request, res: Response) => {
    try {
      const currentRefreshToken = req.cookies.refreshToken
      if (currentRefreshToken) {
        await container.resolve(BlackListRefreshTokenJWTRepository).addJWT(currentRefreshToken)
      }
      const clientIp = requestIp.getClientIp(req);
      const userAgent = req.header('user-agent') ? `${req.header('user-agent')}` : '';
      const userId = (req.headers.userId) ? `${req.headers.userId}` : '';

      const accessToken = await container.resolve(JWTService).createAccessJWT(userId)
      const refreshToken = await container.resolve(JWTService).createRefreshJWT(userId)

      const newPayload: PayloadType = await container.resolve(JWTService).jwt_decode(refreshToken);

      await container.resolve(SecurityDevicesService).createDevices(newPayload, clientIp, userAgent)

      res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
      return res.status(200).send({
        "accessToken": accessToken
      })

    } catch (e) {
      console.log(e)
      return res.status(500)
    }
  })

authRouter.post('/refresh-token',
  container.resolve(JWTService).verifyRefreshTokenAndCheckInBlackList,
  async (req: Request, res: Response) => {
    try {
      const clientIp = requestIp.getClientIp(req);
      const userAgent = req.header('user-agent') ? `${req.header('user-agent')}` : '';
      const currentRefreshToken = req.cookies.refreshToken

      await container.resolve(BlackListRefreshTokenJWTRepository).addJWT(currentRefreshToken)
      const currentPayload: PayloadType = await container.resolve(JWTService).jwt_decode(currentRefreshToken)

      const newAccessToken = await container.resolve(JWTService).updateAccessJWT(currentPayload)
      const newRefreshToken = await container.resolve(JWTService).updateRefreshJWT(currentPayload)

      const newPayload: PayloadType = await container.resolve(JWTService).jwt_decode(newRefreshToken)
      await container.resolve(SecurityDevicesService).updateDevices(currentPayload, newPayload, clientIp, userAgent)

      res.cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true})
      res.status(200).send({accessToken: newAccessToken})
      return

    } catch (e) {
      console.log(e)
      return res.status(401).send({error: e})
    }

  })

authRouter.post('/password-recovery',
  container.resolve(ValidateLast10secReq).byRecovery,
  emailValidation,
  inputValidatorMiddleware,
  async (req: Request, res: Response) => {
    const email = req.body.email
    const user = await container.resolve(UsersService).findUserByLoginOrEmail(email)

    if (!user) {
      const result = await container.resolve(UsersService).sentRecoveryCodeByEmailUserNotExist(email)
      console.log(`Send recovery code to email: ${result?.email}`)
      return res.sendStatus(204)
    }
    const result = await container.resolve(UsersService).sentRecoveryCodeByEmailUserExist(user)
    console.log(`Send recovery code to email: ${result?.accountData.email}`)
    return res.sendStatus(204)
  })

authRouter.post('/new-password',
  container.resolve(ValidateLast10secReq).byNewPassword,
  newPasswordValidation,
  recoveryCodeValidation,
  inputValidatorMiddleware,
  async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword
    const recoveryCode = req.body.recoveryCode

    const user = await container.resolve(UsersService).findByConfirmationCode(recoveryCode)

    if (!user) {
      return res.status(400).send(
        {
          errorsMessages: [{
            message: "incorrect recoveryCode",
            field: "recoveryCode"
          }]
        })
    }
    await container.resolve(UsersService).createNewPassword(newPassword, user)

    return res.sendStatus(204)

  })

authRouter.post('/registration-confirmation',
  container.resolve(Auth).checkIpInBlackList,
  confirmationCodeValidation,
  inputValidatorMiddleware,
  container.resolve(ValidateLast10secReq).byRegisConfirm,
  async (req: Request, res: Response) => {
    const code: string = req.body.code

    const countEmails = await container.resolve(UsersService).countEmailsSentLastHour(code)
    if (countEmails > 10) {
      res.status(429).send('More than 10 emails have been sent in the last hour.')
      return
    }
    const result = await container.resolve(UsersService).confirmByCodeInParams(code)
    if (result === null) {
      res.status(400).send({
        errorsMessages: [
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
  container.resolve(Auth).checkIpInBlackList,
  container.resolve(Auth).checkoutContentType,
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidatorMiddleware,
  container.resolve(Auth).checkUserAccountNotExists,
  container.resolve(ValidateLast10secReq).byRegistration,
  async (req: Request, res: Response) => {
    const clientIp = requestIp.getClientIp(req);
    const userAgent = req.header('user-agent') ? `${req.header('user-agent')}` : '';

    const user = await container.resolve(UsersService).createUserRegistration(req.body.login, req.body.email, req.body.password, clientIp, userAgent);

    if (user) {
      console.log(`Send confirmation code to: ${req.body.email}`)
      res.sendStatus(204);
      return
    }
    res.status(400).send({
      errorsMessages: [
        {
          message: "Login or Email already exists.",
          field: "Login or Email"
        }
      ]
    });
    return
  });

authRouter.post('/registration-email-resending',
  emailValidation,
  inputValidatorMiddleware,
  container.resolve(ValidateLast10secReq).byRecovery,
  async (req: Request, res: Response) => {
    const email: string = req.body.email
    const userResult = await container.resolve(UsersService).updateAndSentConfirmationCodeByEmail(email)
    if (userResult === null) {
      res.status(400).send({
        errorsMessages: [
          {
            "message": "Email not exist or isConfirmed already true.",
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

authRouter.post('/logout',
  container.resolve(JWTService).verifyRefreshTokenAndCheckInBlackList,
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const payload: PayloadType = await container.resolve(JWTService).jwt_decode(refreshToken);

    await container.resolve(BlackListRefreshTokenJWTRepository).addJWT(refreshToken)
    const result = await container.resolve(SecurityDevicesService).deleteDeviceByDeviceIdAfterLogout(payload)
    if (result === "204") {
      return res.sendStatus(204)
    }
    return res.send({logout: result})
  })

authRouter.get("/me",
  container.resolve(Auth).authenticationAccessToken,
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

// just for me

authRouter.get('/resend-registration-email',
  container.resolve(ValidateLast10secReq).byRecovery,
  async (req: Request, res: Response) => {
    const parseQueryData = await ioc.parseQuery.parse(req)
    const code = parseQueryData.code
    if (code === null) {
      res.status(400).send("Query param is empty")
      return
    }
    const user = await container.resolve(UsersService).findByConfirmationCode(code)
    if (user === null || !user.accountData.email) {
      res.status(400).send("Bad code or isConfirmed is true.")
      return
    }
    const result = await container.resolve(UsersService).updateAndSentConfirmationCodeByEmail(user.accountData.email)
    res.send(`Resend code to email:  ${result?.accountData?.email}`)
  })

authRouter.get('/confirm-registration',
  async (req: Request, res: Response) => {
    const parseQueryData = await ioc.parseQuery.parse(req)
    const code = parseQueryData.code
    if (code === null) {
      res.sendStatus(400)
      return
    }
    const result = await container.resolve(UsersService).confirmByCodeInParams(code)
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
    const result = await container.resolve(UsersService).confirmByEmail(req.body.confirmationCode, req.body.email)
    if (result !== null) {
      res.status(201).send("Email confirmed by email and confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.get('/confirm-code/:code',
  async (req: Request, res: Response) => {
    const result = await container.resolve(UsersService).confirmByCodeInParams(req.params.code)
    if (result && result.emailConfirmation.isConfirmed) {
      res.status(201).send("Email confirmed by params confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.delete('/logoutRottenCreatedAt',
  async (req: Request, res: Response) => {
    const result = await container.resolve(UsersService).deleteUserWithRottenCreatedAt()
    res.send(`Total, did not confirm registration user were deleted = ${result}`)
  })
