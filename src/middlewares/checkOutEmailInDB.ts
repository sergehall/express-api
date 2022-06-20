import {Request, Response, NextFunction} from "express";
import {ioc} from "../IoCContainer";


export async function checkOutEmailOrLoginInDB(req: Request, res: Response, next: NextFunction) {
  const email = req.body.email
  const login = req.body.login
  if (email || login) {
    const checkOutEmailInDB = await ioc.authUsersAccountService.findByLoginAndEmail(email, login);
    if (checkOutEmailInDB === null) {
      next()
      return
    }
    res.status(400).send({
      "errorsMessages": [
        {
          message: "That username is taken. Try another.",
          field: "login"
        }
      ]
    });
    return
  }
}