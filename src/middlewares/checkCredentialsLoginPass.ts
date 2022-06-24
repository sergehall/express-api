import  {Request, Response, NextFunction} from "express";
import {ioc} from "../IoCContainer";

export const checkCredentialsLoginPass = async (req: Request, res: Response, next: NextFunction) => {
  const user = await ioc.usersAccountService.checkCredentials(req.body.login, req.body.password)

  if (user === null) {
    res.status(401).send({
      "errorsMessages": [
        {
          message: "Login or password is wrong",
          field: "Login or Password"
        }
      ]
    })
    return
  }
  req.headers.foundId = `${user._id}`
  next()
}