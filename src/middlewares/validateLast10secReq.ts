import {Request, Response, NextFunction} from "express";
import requestIp from "request-ip";
import {ioc} from "../IoCContainer";

export class ValidateLast10secReq {
  message;
  constructor() {
    this.message = 'More than 5 registration attempts from one IP-address during 10 seconds.'
  }


  async byRegisConfirm(req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountByIpAndTimeRegConf(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    return res.status(429).send(this.message)

  }

  async byRegistration(req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountByIpAndTimeReg(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    res.status(429).send(this.message)
    return
  }

  async byLogin(req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountByIpAndTimeLog(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    return res.status(429).send(this.message)
  }

  async byRecovery(req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountByIpAndTimeRegEmailRes(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    return res.status(429).send(this.message)
  }

  async byNewPassword(req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountSameIpNewPasswordReq(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    return res.status(429).send(this.message)
  }
}

