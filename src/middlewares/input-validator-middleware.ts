import {NextFunction, Request, Response} from "express";
import {body, param, validationResult} from "express-validator";


const youtubeUrlRegExp = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'

// posts and bloggers validator
export const titleValidation = body("title").trim().isLength({
  min: 3,
  max: 30
}).withMessage("title must be >3 <30 characters.")
export const shortDescriptionValidation = body("shortDescription").trim().isLength({
  min: 3,
  max: 100
}).withMessage("shortDescription must be >3 and <100 characters.")
export const contentValidation = body("content").trim().isLength({
  min: 3,
  max: 1000
}).withMessage("content must be >3 and <100 characters.")
export const postIdParamsValidation = param('postId').trim().isInt().withMessage('params postId must be Int')
export const nameValidation = body("name").trim().isLength({
  min: 3,
  max: 15
}).withMessage("Name must be >3 and <15 characters.")
export const bloggerIdParamsValidation = param('bloggerId').trim().isInt().withMessage('param bloggerId must be Int')
export const validatorUrl = body("youtubeUrl").trim().matches(youtubeUrlRegExp).isLength({
  min: 0,
  max: 100
}).withMessage("\"youtubeUrl2 should be maxLength=100 or matched to pattern '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'")

//users validator
export const bodyLogin = body(['login']).isString().withMessage('Login must be string')
export const bodyEmail= body(['email']).isString().withMessage('Email must be string')
export const bodyPassword = body(['password']).isString().withMessage('Password must be string')

// db
export const MongoHasNotUpdated = {
  message: "Mongo database has not updated the data",
  field: "MongoDb"
}
export const notFoundBloggerId = {
  message: "Invalid 'bloggerId' such blogger doesn't exist",
  field: "bloggerId"
}
export const notFoundPostId = {
  message: "Invalid '/:postId' such post doesn't exist",
  field: "postId"
}

const bloggerIdBodyRegExp2 = /^\d+$/i
export const  bloggerIdBodyValidator = body('bloggerId').matches(bloggerIdBodyRegExp2).withMessage('body.bloggerId must be Int')

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorsMessages: errors.array().map(e => {
        return {
          message: e.msg,
          field: e.param
        }
      }), resultCode: 1
    });
  } else {
    next()
  }
}


export const checkoutMongoDbId = (req: Request, res: Response, next: NextFunction) => {
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