import {Router, Request, Response} from "express"
import {myContainer} from "../types/container";
import {BusinessService} from "../domain/business-service";
import {AuthMiddlewares} from "../middlewares/authMiddlewares";


export const emailRouter = Router({})

const businessService = myContainer.resolve<BusinessService>(BusinessService)
const authMiddlewares = myContainer.resolve<AuthMiddlewares>(AuthMiddlewares)

emailRouter
  .post("/send",
    async (req: Request, res: Response) => {
    await businessService.doSendEmailSimple(req.body.to, req.body.subject, req.body.text)
    res.send("Email sent")
  })

  .post("/recovery-password",
    authMiddlewares.authenticationAccessToken,
    async (req: Request, res: Response) => {
    if (!req.user) {
      return res.sendStatus(401)
    }
    await businessService.sendEmailRecoveryPassword(req.user, req.body.token)
    res.send("recovery-password sent")
  })

