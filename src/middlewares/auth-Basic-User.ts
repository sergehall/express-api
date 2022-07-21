import {NextFunction, Request, Response} from "express";

const base64 = require('base-64');


export class AuthMiddlewareBasicAuthorization {
  async authBasicCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const expectedAuthHeaderValue = "Basic " + base64.encode("admin:qwerty")

      if (req.headers.authorization !== expectedAuthHeaderValue) {
        return res.sendStatus(401)
      }
      next();
    } catch (e) {
      res.sendStatus(401)
    }
  }
}