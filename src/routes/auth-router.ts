import {Router, Request, Response} from "express";
import {ioc} from "../IoCContainer";
import requestIp from 'request-ip';
import {
  confirmationCodeValidation,
  emailValidation,
  inputValidatorMiddleware,
  loginValidation, newPasswordValidation,
  passwordValidation, recoveryCodeValidation
} from "../middlewares/input-validator-middleware";
import {PayloadType, SessionDevicesType} from "../types/types";

export const authRouter = Router({})

authRouter.post('/login',
  loginValidation,
  passwordValidation,
  inputValidatorMiddleware,
  ioc.validateLast10secReq.byLogin,
  ioc.auth.checkCredentialsLoginPass,
  async (req: Request, res: Response) => {
    try {
      const currentRefreshToken = req.cookies.refreshToken
      if (currentRefreshToken) {
        await ioc.blackListRefreshTokenJWTRepository.addJWT(currentRefreshToken)
      }
      const clientIp = requestIp.getClientIp(req);
      const title = req.header('user-agent');
      const userId = (req.headers.userId) ? `${req.headers.userId}` : '';

      const accessToken = await ioc.jwtService.createUsersAccountJWT(userId)
      const refreshToken = await ioc.jwtService.createUsersAccountRefreshJWT(userId)

      const payload: PayloadType = ioc.jwtService.jwt_decode(refreshToken);
      const newDevices: SessionDevicesType = {
        userId: payload.userId,
        ip: clientIp,
        title: title,
        lastActiveDate: new Date(payload.iat * 1000).toISOString(),
        expirationDate: new Date(payload.exp * 1000).toISOString(),
        deviceId: payload.deviceId
      }
      const filter = {title: title, ip: clientIp}
      await ioc.securityDevicesService.createOrUpdateDevices(filter, newDevices)

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
  ioc.jwtService.verifyRefreshTokenAndCheckInBlackList,
  async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken
      const payload: PayloadType = ioc.jwtService.jwt_decode(refreshToken)
      const clientIp = requestIp.getClientIp(req);
      const title = req.header('user-agent');
      await ioc.blackListRefreshTokenJWTRepository.addJWT(refreshToken)

      const newAccessToken = await ioc.jwtService.updateUsersAccountAccessJWT(payload)
      const newRefreshToken = await ioc.jwtService.updateUsersAccountRefreshJWT(payload)

      const newPayload: PayloadType = ioc.jwtService.jwt_decode(newRefreshToken)
      const filter = {userId: payload.userId, deviceId: payload.deviceId}
      const newDevices: SessionDevicesType = {
        userId: payload.userId,
        ip: clientIp,
        title: title,
        lastActiveDate: new Date(newPayload.iat * 1000).toISOString(),
        expirationDate: new Date(newPayload.exp * 1000).toISOString(),
        deviceId: payload.deviceId
      }
      await ioc.securityDevicesService.createOrUpdateDevices(filter, newDevices)
      res.cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true})
      res.status(200).send({accessToken: newAccessToken})
      return

    } catch (e) {
      console.log(e)
      return res.status(401).send({error: e})
    }

  })

authRouter.post('/password-recovery',
  ioc.validateLast10secReq.byRecovery,
  emailValidation,
  inputValidatorMiddleware,
  async (req: Request, res: Response) => {
    const email = req.body.email
    const user = await ioc.usersAccountService.findUserByLoginOrEmail(email)
    if (!user) {
      const result = await ioc.usersAccountService.sentRecoveryCodeByEmailUserNotExist(email)
      console.log(`Resend password-recovery to email:  ${result?.email}`)
      return res.sendStatus(204)
    }
    const result = await ioc.usersAccountService.sentRecoveryCodeByEmailUserExist(user)
    console.log(`Resend password-recovery to email:  ${result?.accountData.email}`)
    return res.sendStatus(204)
  })

authRouter.post('/new-password',
  ioc.validateLast10secReq.byNewPassword,
  newPasswordValidation,
  recoveryCodeValidation,
  inputValidatorMiddleware,
  async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword
    const recoveryCode = req.body.recoveryCode

    const user = await ioc.usersAccountService.findByConfirmationCode(recoveryCode)
    if (!user) {
      return res.status(400).send(
        {
          errorsMessages: [{
            message: "incorrect recoveryCode",
            field: "recoveryCode"
          }]
        })
    }
    await ioc.usersAccountService.createNewPassword(newPassword, user)

    return res.sendStatus(204)

  })

authRouter.post('/registration-confirmation',
  ioc.auth.checkIpInBlackList,
  confirmationCodeValidation,
  inputValidatorMiddleware,
  ioc.validateLast10secReq.byRegisConfirm,
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
  ioc.auth.checkIpInBlackList,
  ioc.auth.checkoutContentType,
  loginValidation, passwordValidation, emailValidation, inputValidatorMiddleware,
  ioc.auth.checkUserAccountNotExists,
  ioc.validateLast10secReq.byRegistration,
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
  emailValidation, inputValidatorMiddleware,
  ioc.validateLast10secReq.byRecovery,
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

authRouter.post('/logout',
  ioc.jwtService.verifyRefreshTokenAndCheckInBlackList,
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const payload: PayloadType = ioc.jwtService.jwt_decode(refreshToken);
    await ioc.blackListRefreshTokenJWTRepository.addJWT(refreshToken)
    const result = await ioc.securityDevicesService.deleteDeviceByDeviceIdAfterLogout(payload)
    if (result === "204") {
      return res.sendStatus(204)
    }
    return res.send({logout: result})
  })

authRouter.get("/me",
  ioc.auth.authenticationAccessToken,
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
  ioc.validateLast10secReq.byRecovery,
  async (req: Request, res: Response) => {
    const parseQueryData = await ioc.parseQuery.parse(req)
    const code = parseQueryData.code
    if (code === null) {
      res.status(400).send("Query param is empty")
      return
    }
    const user = await ioc.usersAccountService.findByConfirmationCode(code)
    if (user === null || !user.accountData.email) {
      res.status(400).send("Bad code or isConfirmed is true.")
      return
    }
    const result = await ioc.usersAccountService.updateAndSentConfirmationCodeByEmail(user.accountData.email)
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
