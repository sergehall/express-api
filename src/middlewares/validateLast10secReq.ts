import {Request, Response, NextFunction} from "express";
import requestIp from "request-ip";
import {injectable} from "inversify";
import {myContainer} from "../types/container";
import {UsersIPLast10secRepositories} from "../repositories/usersIPlast10sec-db-repository";


@injectable()
export class ValidateLast10secReq {

  async byRegisConfirm(req: Request, res: Response, next: NextFunction) {
    const usersIPLast10secRepositories = await myContainer.resolve(UsersIPLast10secRepositories)
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await usersIPLast10secRepositories.addAndCountByIpAndTimeRegConf(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    return res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')

  }

  async byRegistration(req: Request, res: Response, next: NextFunction) {
    const usersIPLast10secRepositories = await myContainer.resolve(UsersIPLast10secRepositories)
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await usersIPLast10secRepositories.addAndCountByIpAndTimeReg(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
    return
  }

  async byLogin(req: Request, res: Response, next: NextFunction) {
    const usersIPLast10secRepositories = await myContainer.resolve(UsersIPLast10secRepositories)
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await usersIPLast10secRepositories.addAndCountByIpAndTimeLog(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    return res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
  }

  async byRecovery(req: Request, res: Response, next: NextFunction) {
    const usersIPLast10secRepositories = await myContainer.resolve(UsersIPLast10secRepositories)
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await usersIPLast10secRepositories.addAndCountByIpAndTimeRegEmailRes(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    return res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
  }

  async byNewPassword(req: Request, res: Response, next: NextFunction) {
    const usersIPLast10secRepositories = await myContainer.resolve(UsersIPLast10secRepositories)
    const clientIp = requestIp.getClientIp(req);
    const countRegistrationAttempts = await usersIPLast10secRepositories.addAndCountSameIpNewPasswordReq(clientIp)

    if (countRegistrationAttempts <= 5) {
      return next()
    }
    return res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
  }
}

