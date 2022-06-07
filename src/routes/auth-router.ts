import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {ioc} from "../IoCContainer";
import {checkoutIPFromBlackList} from "../middlewares/middleware-checkoutIPFromBlackList";
import requestIp from 'request-ip';


export const authRouter = Router({})

authRouter.post('/registration', checkoutIPFromBlackList,
  async (req: Request, res: Response) => {
    const clientIp = requestIp.getClientIp(req);
    const  countItWithIsConnectedFalse = await ioc.authUsersAccountService.checkHowManyTimesUserLoginLastHourWithSameIp(clientIp)
    if (countItWithIsConnectedFalse > 10) {
      res.status(403).send('Too many attempts (countItWithIsConnectedFalse)')
      return
    }
    const user = await ioc.authUsersAccountService.createUserRegistration(req.body.login, req.body.email, req.body.password, clientIp);

    if (user) {
      res.status(200)
      res.send(user);

    } else {
      res.status(400).send('User already exists or invalid data or something else');
    }
  });

authRouter.post('/confirm-email',
  async (req: Request, res: Response) => {
    const result = await ioc.authUsersAccountService.confirmByEmail(req.body.confirmationCode, req.body.email)
    if (result !== null) {
      res.status(201).send("Email confirmed by email and confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.get('/confirm-code/:code',
  async (req: Request, res: Response) => {
    const result = await ioc.authUsersAccountService.confirmByCodeInParams(req.params.code)
    if (result && result.emailConfirmation.isConfirmed) {
      res.status(201).send("Email confirmed by params confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.post('/resend-registration-code',
  async (req: Request, res: Response) => {
    // need to finish, from postman I understand how to take the info to search for a query when
    // I click the link in the email itself I do not know
    const result = await ioc.authUsersAccountService.updateAndSentConfirmationCode(req.body.email, req.body.password)
    if (result?.accountData?.email === undefined) {
      res.status(400).send("Bad Request or isConfirmed is true");
      return
    }
    res.send(`Resend code to email:  ${result?.accountData?.email}`)
  })

authRouter.delete('/logout',
  async (req: Request, res: Response) => {
    const result = await ioc.authUsersAccountService.deleteUserWithRottenCreatedAt()
    res.send(`Total, did not confirm registration user were deleted = ${result}`)
  })


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

