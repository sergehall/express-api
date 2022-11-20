import {NextFunction, Request, Response} from "express";
import {body, check, param, validationResult} from "express-validator";


//...........................param
export const postIdParamsValidation = param('postId').isString().withMessage("postIdParamsValidation must be string.")
export const blogIdParamsValidation = param('blogId').isString().withMessage("blogIdParamsValidation5")
export const idParamsValidation = param('id').trim().isLength({min: 1, max: 50}).withMessage("'param userId must string and >1 and <50 characters.")
export const userIdParamsValidation = param('userId').trim().isLength({min: 1, max: 50}).withMessage("'param userId must string and >1 and <50 characters.")
//...........................body
export const titleValidation = body("title").trim().isLength({min: 1, max: 30}).withMessage("title must be >1 and <30 characters.")
export const shortDescriptionValidation = body("shortDescription").trim().isLength({min: 1, max: 100}).withMessage("shortDescription must be >1 and <100 characters.")
export const contentValidation = body("content").trim().isLength({min: 1, max: 1000}).withMessage("content must be >1 and <1000 characters.")
export const blogIdBodyValidator = body('blogId').trim().isString().isLength({min: 1, max: 100}).withMessage("blogId should be >1 and <100 ch.")
export const nameValidation = body("name").trim().isLength({min: 1, max: 15}).withMessage("Name must be >1 and <15 characters.")
export const urlValidation = body("websiteUrl").trim().matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').isLength({min: 15, max: 100}).withMessage("\"youtubeUrl2 should be maxLength=100 or matched to pattern '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'")
export const loginOrEmailValidation = body(['loginOrEmail']).isString().withMessage('Login must be string').isLength({min: 1, max: 20}).withMessage("bodyLogin must be >1 and <20 characters.")
export const loginValidation = body(['login']).isString().withMessage('Login must be string').isLength({min: 1, max: 20}).withMessage("bodyLogin must be >1 and <20 characters.")
export const passwordValidation = body(['password']).trim().isString().withMessage('Password must be string').isLength({min: 6, max: 20}).withMessage("bodyPassword must be >6 and <20 characters.")
export const emailValidation = body(['email']).matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage("Email should be matched to pattern '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'")
export const confirmationCodeValidation = body(['code']).trim().isString().withMessage('confirmationCode must be string').isLength({min: 1, max: 2000}).withMessage("confirmationCode must be >1 and <2000 characters.")
export const contentCommentValidation = body("content").trim().isLength({min: 20, max: 300}).withMessage("content must be >20 and <300 characters.")
export const newPasswordValidation = body(['newPassword']).trim().isString().withMessage('newPassword must be string').isLength({min: 6, max: 20}).withMessage("bodyPassword must be >6 and <20 characters.")
export const recoveryCodeValidation = body(['recoveryCode']).trim().isString().withMessage('recoveryCode must be string').isLength({min: 1, max: 2000}).withMessage("recoveryCode must be >1 and <2000 characters.")
//...........................check
export const likeStatusValidator = check('likeStatus').isIn(["None", "Like", "Dislike"])


export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorsMessages: errors.array().map(e => {
        return {
          message: e.msg,
          field: e.param
        }
      })
    });
  } else {
    next()
  }
}