import {Router, Request, Response} from "express"
import {container} from "../Container";
import {BusinessService} from "../domain/business-service";
import {AuthMiddlewares} from "../middlewares/authMiddlewares";


export const emailRouter = Router({})

const businessService = container.resolve<BusinessService>(BusinessService)
const authMiddlewares = container.resolve<AuthMiddlewares>(AuthMiddlewares)

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

