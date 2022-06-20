import {Request, Response, NextFunction} from "express";
import {ioc} from "../IoCContainer";


export async function checkOutEmailOrLoginInDB(req: Request, res: Response, next: NextFunction) {
  const email = req.body.email;
  const login = req.body.login;
  let errorMessage = {};
  if (email || login) {
    const checkOutEmailInDB = await ioc.authUsersAccountService.findByLoginAndEmail(email, login);
    if (checkOutEmailInDB === null) {
      next()
      return
    }

    if (checkOutEmailInDB.accountData.email !== email) {
      errorMessage = {
        message: "Invalid email.",
        field: "email"
      }
    }
    if (checkOutEmailInDB.accountData.login !== login) {
      errorMessage = {
        message: "Invalid login.",
        field: "login"
      }
    }
    res.status(400).send({
      errorsMessages: [errorMessage]
    });
    return
  }
}