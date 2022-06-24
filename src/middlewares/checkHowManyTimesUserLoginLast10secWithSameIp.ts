import {NextFunction, Request, Response} from "express";
import requestIp from "request-ip";
import {ioc} from "../IoCContainer";


export const checkHowManyTimesUserLoginLast10secWithSameIpRegConf = async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = requestIp.getClientIp(req);
  const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.findByIpAndTimeRegConf(clientIp)

  if (countRegistrationAttempts <= 5) {
    next()
    return
  }
  res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
  return
}

export const checkHowManyTimesUserLoginLast10secWithSameIpReg = async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = requestIp.getClientIp(req);
  const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.findByIpAndTimeReg(clientIp)

  if (countRegistrationAttempts <= 5) {
    next()
    return
  }
  res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
  return
}

export const checkHowManyTimesUserLoginLast10secWithSameIpLog = async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = requestIp.getClientIp(req);
  const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.findByIpAndTimeLog(clientIp)

  if (countRegistrationAttempts <= 5) {
    next()
    return
  }
  res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
  return
}

export const checkHowManyTimesUserLoginLast10secWithSameIpRegEmailRes = async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = requestIp.getClientIp(req);
  const  countRegistrationAttempts = await ioc.usersIPLast10secRepositories.findByIpAndTimeRegEmailRes(clientIp)

  if (countRegistrationAttempts <= 5) {
    next()
    return
  }
  res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
  return
}

