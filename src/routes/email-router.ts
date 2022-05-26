import {Router, Request, Response} from "express"
import {businessService} from "../domain/business-service";


export const emailRouter = Router({})


emailRouter
  .post("/send", async (req: Request, res: Response) => {
    await businessService.doSendEmailSimple(req.body.to, req.body.subject, req.body.text)
    res.send("Email sent")
  })
  .post("/recovery-password", async (req: Request, res: Response) => {
    await businessService.sendEmailRecoveryPassword(req.user, req.body.token)
    res.send("recovery-password sent")
  })

