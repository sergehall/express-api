import {NextFunction, Request, Response} from "express";
import requestIp from "request-ip";
import {ioc} from "../IoCContainer";

export class AddAndCountReqWithSameIpLast10secService {
  async byRegisConfirm (req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountByIpAndTimeRegConf(clientIp)

    if (countRegistrationAttempts <= 5) {
      next()
      return
    }
    res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
    return
  }

  async byRegistration (req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountByIpAndTimeReg(clientIp)

    if (countRegistrationAttempts <= 5) {
      next()
      return
    }
    res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
    return
  }

  async byLogin (req: Request, res: Response, next: NextFunction){
    const clientIp = requestIp.getClientIp(req);
    const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountByIpAndTimeLog(clientIp)

    if (countRegistrationAttempts <= 5) {
      next()
      return
    }
    res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
    return
  }

  async byRecovery (req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountByIpAndTimeRegEmailRes(clientIp)

    if (countRegistrationAttempts <= 5) {
      next()
      return
    }
    res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
    return
  }

  async byNewPassword (req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.addAndCountSameIpNewPasswordReq(clientIp)

    if (countRegistrationAttempts <= 5) {
      next()
      return
    }
    res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
    return
  }
}

