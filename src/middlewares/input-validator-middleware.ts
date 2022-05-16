import {NextFunction, Request, Response} from "express";
import {body, param, validationResult} from "express-validator";



// posts and bloggers validator
export const titleValidation = body("title").trim().isLength({
  min: 1,
  max: 30
}).withMessage("title must be >1 and <30 characters.")
export const shortDescriptionValidation = body("shortDescription").trim().isLength({
  min: 1,
  max: 100
}).withMessage("shortDescription must be >1 and <100 characters.")
export const contentValidation = body("content").trim().isLength({
  min: 1,
  max: 1000
}).withMessage("content must be >1 and <100 characters.")
export const postIdParamsValidation = param('postId').trim().isLength({
  min: 1,
  max: 100
}).withMessage("shortDescription must be >1 and <30 characters.")

export const nameValidation = body("name").trim().isLength({
  min: 1,
  max: 15
}).withMessage("Name must be >1 and <15 characters.")
export const bloggerIdParamsValidation = param('bloggerId').trim().isInt().withMessage('param bloggerId must be Int')
const userIdBodyRegExp = /^\d+$/i
export const  userIdParamsValidation = param('userId').matches(userIdBodyRegExp).withMessage('param userId must be Int')
const youtubeUrlRegExp = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'
export const validatorUrl = body("youtubeUrl").trim().matches(youtubeUrlRegExp).isLength({
  min: 0,
  max: 100
}).withMessage("\"youtubeUrl2 should be maxLength=100 or matched to pattern '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'")

//users validator
export const bodyLogin = body(['login']).trim().isString().withMessage('Login must be string').isLength({
  min: 3,
  max: 10
}).withMessage("bodyLogin must be >3 and <10 characters.")
export const bodyEmail= body(['email']).trim().isString().withMessage('Email must be string')
export const bodyPassword = body(['password']).isString().withMessage('Password must be string').isLength({
  min: 6,
  max: 20
}).withMessage("bodyPassword must be >3 and <20 characters.")

// db
export const MongoHasNotUpdated = {
  message: "Mongo database has not updated the data",
  field: "MongoDb"
}
export const notFoundBloggerId = {
  message: "Invalid 'bloggerId' such blogger doesn't exist",
  field: "Not found bloggerId"
}
export const notFoundPostId = {
  message: "Invalid '/:postId' such post doesn't exist",
  field: "Not found postId"
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