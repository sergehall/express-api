import {NextFunction, Request, Response} from "express";


export class CheckoutMongoDbId {
  async checkOut(req: Request, res: Response, next: NextFunction) {
    const mongoDbIdRegExp = /^([\da-f]{24})$/i
    const paramsMongoId = req.params.mongoId;
    if (paramsMongoId.match(mongoDbIdRegExp) === null) {
      return res.status(400).json(
        {
          errorsMessages: [{paramsMongoId: "Argument passed in must be a string of 24 hex characters."}],
          resultCode: 1
        })
    } else {
      next()
    }
  }
}