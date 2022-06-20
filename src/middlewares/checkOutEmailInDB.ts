import {Request, Response, NextFunction} from "express";
import {ioc} from "../IoCContainer";


export async function checkOutEmailOrLoginInDB(req: Request, res: Response, next: NextFunction) {
  const email = req.body.email
  if (email) {
    const checkOutEmailInDB = await ioc.authUsersAccountService.findByLoginOrEmail(email);
    if (checkOutEmailInDB === null) {
      next()
      return
    }
    res.status(400).send('User with this email already exists!');
    return
  }
}