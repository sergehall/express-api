import {Request, Response, NextFunction} from "express";
import requestIp from 'request-ip';
import {ioc} from "../IoCContainer";


export async function  checkoutIPFromBlackList(req: Request, res: Response, next: NextFunction) {
  const clientIp = requestIp.getClientIp(req);
  if(clientIp) {
    const result = await ioc.blackListIPRepository.checkoutIPinBlackList(clientIp);
    if (result === null ) {
      return res.status(400).send('Black list IP1') // need thinks
    }
    next()
    return
  }
  return res.status(400).send('Bad IP2'); // need thinks
}