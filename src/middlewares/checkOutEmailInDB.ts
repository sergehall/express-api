import {Request, Response, NextFunction} from "express";
import {ioc} from "../IoCContainer";

export class CheckOutEmailOrLoginInDB {
  async checkOut(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const login = req.body.login;
    let errorMessage = {};
    if (email || login) {
      const checkOutEmailInDB = await ioc.usersAccountService.findByLoginAndEmail(email, login);
      if (checkOutEmailInDB === null) {
        next()
        return
      }
      if (checkOutEmailInDB.accountData.email === email) {
        errorMessage = {
          message: "Email already exist.",
          field: "email"
        }
      }
      if (checkOutEmailInDB.accountData.login === login) {
        errorMessage = {
          message: "Login already exist",
          field: "login"
        }
      }
      res.status(400).send({
        errorsMessages: [errorMessage]
      });
      return
    }
  }
}