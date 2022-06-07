import {Request, Response, NextFunction} from "express";


export async function checkoutContentType(req: Request, res: Response, next: NextFunction) {
  if (req.headers['content-type'] === 'application/json') {
    next()
    return
  }
  res.status(400).send('Bad content type')
  return
}