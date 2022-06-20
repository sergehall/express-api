import {NextFunction, Request, Response} from "express";
import requestIp from "request-ip";
import {ioc} from "../IoCContainer";


export const checkHowManyTimesUserLoginLast10secWithSameIp = async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = requestIp.getClientIp(req);
  const  countRegistrationAttempts = await ioc.usersIPLast10secRepository.findByIpAndTime(clientIp)

  if (countRegistrationAttempts <= 5) {
    next()
    return
  }
  res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.')
  return
}