import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {ioc} from "../IoCContainer";
import requestIp from 'request-ip';


export const authRouter = Router({})

authRouter.post('/registration',
  async (req: Request, res: Response) => {
    const clientIp = requestIp.getClientIp(req);
    const  countItWithIsConnectedFalse = await ioc.authService.checkHowManyTimesUserLoginLastHourWithSameIp(clientIp)
    if (countItWithIsConnectedFalse > 10) {
      res.status(403).send('Too many attempts')
      return
    }
    const user = await ioc.authService.createUserRegistration(req.body.login, req.body.email, req.body.password, clientIp);

    if (user) {
      res.status(200)
      res.send(user);

    } else {
      res.status(400).send('User already exists or invalid data or something else');
    }
  });

authRouter.post('/confirm-email',
  async (req: Request, res: Response) => {
    const result = await ioc.authService.confirmByEmail(req.body.confirmationCode, req.body.email)
    if (result !== null) {
      res.status(201).send("Email confirmed by email and confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.get('/confirm-code/:code',
  async (req: Request, res: Response) => {
    const result = await ioc.authService.confirmByCodeInParams(req.params.code)
    if (result && result.emailConfirmation.isConfirmed) {
      res.status(201).send("Email confirmed by params confirmationCode.");
    } else {
      res.sendStatus(400)
    }
  })

authRouter.post('/resend-registration-code/:todo',
  async (req: Request, res: Response) => {
    if (req.params.todo === "todo") {
      res.send("When you finish and then you will click on this link")
    }
    // need to finish, from postman I understand how to take the info to search for a query when
    // I click the link in the email itself I do not know
    const result = await ioc.authService.updateAndSentConfirmationCode(req.body.email, req.body.password)
    res.send(`resend code to email:  ${result?.accountData?.email}`)
  })

authRouter.delete('/logout',
  async (req: Request, res: Response) => {
    const result = await ioc.authService.deleteUserWithRottenCreatedAt()
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

