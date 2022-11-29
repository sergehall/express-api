import {Router, Request, Response} from "express";
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
import {myContainer} from "../types/container";
import {PayloadType} from "../types/tsTypes";
import {JWTService} from "../application/jwt-service";
import {SecurityDevicesService} from "../domain/securityDevices-service";
import {UsersService} from "../domain/users-service";
import {
  BlackListRefreshTokenJWTRepository
} from "../repositories/blackListRefreshTokenJWT-db-repository";
import {ValidateLast10secReq} from "../middlewares/validateLast10secReq";
import {AuthMiddlewares} from "../middlewares/authMiddlewares";
import {ParseQuery} from "../middlewares/parse-query";


export const authRouter = Router({})

const jwtService = myContainer.resolve<JWTService>(JWTService)
const securityDevicesService = myContainer.resolve<SecurityDevicesService>(SecurityDevicesService)
const blackListRefreshTokenJWTRepository = myContainer.resolve(BlackListRefreshTokenJWTRepository)
const authMiddlewares = myContainer.resolve<AuthMiddlewares>(AuthMiddlewares)
const validateLast10secReq = myContainer.resolve<ValidateLast10secReq>(ValidateLast10secReq)
const usersService = myContainer.resolve<UsersService>(UsersService)
const parseQuery = myContainer.resolve<ParseQuery>(ParseQuery)

authRouter.post('/login',
  loginOrEmailValidation,
  passwordValidation,
  inputValidatorMiddleware,
  validateLast10secReq.byLogin,
  authMiddlewares.checkCredentialsLoginPass,
  async (req: Request, res: Response) => {
    try {
      const currentRefreshToken = req.cookies.refreshToken
      if (currentRefreshToken) {
        await blackListRefreshTokenJWTRepository.addJWT(currentRefreshToken)
      }
      const clientIp = requestIp.getClientIp(req);
      const userAgent = req.header('user-agent') ? `${req.header('user-agent')}` : '';
      const userId = (req.headers.userId) ? `${req.headers.userId}` : '';

      const accessToken = await jwtService.createAccessJWT(userId)
      const refreshToken = await jwtService.createRefreshJWT(userId)

      const newPayload: PayloadType = await jwtService.jwt_decode(refreshToken);

      await securityDevicesService.createDevices(newPayload, clientIp, userAgent)

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
  jwtService.verifyRefreshTokenAndCheckInBlackList,
  async (req: Request, res: Response) => {
    try {
      const clientIp = requestIp.getClientIp(req);
      const userAgent = req.header('user-agent') ? `${req.header('user-agent')}` : '';
      const currentRefreshToken = req.cookies.refreshToken

      await blackListRefreshTokenJWTRepository.addJWT(currentRefreshToken)
      const currentPayload: PayloadType = await jwtService.jwt_decode(currentRefreshToken)

      const newAccessToken = await jwtService.updateAccessJWT(currentPayload)
      const newRefreshToken = await jwtService.updateRefreshJWT(currentPayload)

      const newPayload: PayloadType = await jwtService.jwt_decode(newRefreshToken)
      await securityDevicesService.updateDevices(currentPayload, newPayload, clientIp, userAgent)

      res.cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true})
      res.status(200).send({accessToken: newAccessToken})
      return

    } catch (e) {
      console.log(e)
      return res.status(401).send({error: e})
    }

  })

authRouter.post('/password-recovery',
  validateLast10secReq.byRecovery,
  emailValidation,
  inputValidatorMiddleware,
  async (req: Request, res: Response) => {
    const email = req.body.email
    const user = await usersService.findUserByLoginOrEmail(email)

    if (!user) {
      const result = await usersService.sentRecoveryCodeByEmailUserNotExist(email)
      console.log(`Send recovery code to email: ${result?.email}`)
      return res.sendStatus(204)
    }
    const result = await usersService.sentRecoveryCodeByEmailUserExist(user)
    console.log(`Send recovery code to email: ${result?.accountData.email}`)
    return res.sendStatus(204)
  })

authRouter.post('/new-password',
  validateLast10secReq.byNewPassword,
  newPasswordValidation,
  recoveryCodeValidation,
  inputValidatorMiddleware,
  async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword
    const recoveryCode = req.body.recoveryCode

    const user = await usersService.findByConfirmationCode(recoveryCode)

    if (!user) {
      return res.status(400).send(
        {
          errorsMessages: [{
            message: "incorrect recoveryCode",
            field: "recoveryCode"
          }]
        })
    }
    await usersService.createNewPassword(newPassword, user)

    return res.sendStatus(204)

  })

authRouter.post('/registration-confirmation',
  authMiddlewares.checkIpInBlackList,
  confirmationCodeValidation,
  inputValidatorMiddleware,
  validateLast10secReq.byRegisConfirm,
  async (req: Request, res: Response) => {
    const code: string = req.body.code
    const countEmails = await usersService.countEmailsSentLastHour(code)
    if (countEmails > 10) {
      res.status(429).send('More than 10 emails have been sent in the last hour.')
      return
    }
    const result = await usersService.confirmByCodeInParams(code)
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
  authMiddlewares.checkIpInBlackList,
  authMiddlewares.checkoutContentType,
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidatorMiddleware,
  authMiddlewares.checkUserAccountNotExists,
  validateLast10secReq.byRegistration,
  async (req: Request, res: Response) => {
    const clientIp = requestIp.getClientIp(req);
    const userAgent = req.header('user-agent') ? `${req.header('user-agent')}` : '';

    const user = await usersService.createUserRegistration(req.body.login, req.body.email, req.body.password, clientIp, userAgent);

    if (user) {
      console.log(`Send confirmation code to: ${user.accountData.email}`)
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
  validateLast10secReq.byRecovery,
  async (req: Request, res: Response) => {
    const email: string = req.body.email
    const userResult = await usersService.updateAndSentConfirmationCodeByEmail(email)
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
  jwtService.verifyRefreshTokenAndCheckInBlackList,
  async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    const payload: PayloadType = await jwtService.jwt_decode(refreshToken);

    await blackListRefreshTokenJWTRepository.addJWT(refreshToken)
    const result = await securityDevicesService.deleteDeviceByDeviceIdAfterLogout(payload)
    if (result === "204") {
      return res.sendStatus(204)
    }
    return res.send({logout: result})
  })

authRouter.get("/me",
  authMiddlewares.authenticationAccessToken,
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
  validateLast10secReq.byRecovery,
  async (req: Request, res: Response) => {
    const parseQueryData = await parseQuery.parse(req)
    const code = parseQueryData.code
    if (code === null) {
      res.status(400).send("Query param is empty")
      return
    }
    const user = await usersService.findByConfirmationCode(code)
    if (user === null || !user.accountData.email) {
      res.status(400).send("Bad code or isConfirmed is true.")
      return
    }
    const result = await usersService.updateAndSentConfirmationCodeByEmail(user.accountData.email)
    res.send(`Resend code to email:  ${result?.accountData?.email}`)
  })

authRouter.get('/confirm-registration',
  async (req: Request, res: Response) => {
    const parseQueryData = await parseQuery.parse(req)
    const code = parseQueryData.code
    if (code === null) {
      res.sendStatus(400)
      return
    }
    const result = await usersService.confirmByCodeInParams(code)
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
    const result = await usersService.confirmByEmail(req.body.confirmationCode, req.body.email)
    if (result !== null) {
      res.status(201).send("Email confirmed by email and confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.get('/confirm-code/:code',
  async (req: Request, res: Response) => {
    const result = await usersService.confirmByCodeInParams(req.params.code)
    if (result && result.emailConfirmation.isConfirmed) {
      res.status(201).send("Email confirmed by params confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.delete('/logoutRottenCreatedAt',
  async (req: Request, res: Response) => {
    const result = usersService.deleteUserWithRottenCreatedAt()
    res.send(`Total, did not confirm registration user were deleted = ${result}`)
  })
