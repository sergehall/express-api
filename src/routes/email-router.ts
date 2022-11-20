import {Router, Request, Response} from "express"
import {businessService} from "../domain/business-service";
import {ioc} from "../IoCContainer";


export const emailRouter = Router({})


emailRouter
  .post("/send",
    async (req: Request, res: Response) => {
    await businessService.doSendEmailSimple(req.body.to, req.body.subject, req.body.text)
    res.send("Email sent")
  })

  .post("/recovery-password",
    ioc.auth.authenticationAccessToken,
    async (req: Request, res: Response) => {
    if (!req.user) {
      return res.sendStatus(401)
    }
    await businessService.sendEmailRecoveryPassword(req.user, req.body.token)
    res.send("recovery-password sent")
  })

