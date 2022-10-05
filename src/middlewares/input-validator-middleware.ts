import {NextFunction, Request, Response} from "express";
import {body, check, param, validationResult} from "express-validator";


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
}).withMessage("content must be >1 and <1000 characters.")
export const postIdParamsValidation = param('postId').isString().withMessage("postIdParamsValidation must be string.")
// const bloggerIdBodyRegExp2 = /^\d+$/i
// export const bloggerIdBodyValidator = body('bloggerId').matches(bloggerIdBodyRegExp2).withMessage('body.bloggerId must be Int')
// export const bloggerIdBodyValidator = body('blogId').isString().withMessage("bloggerIdBodyValidator")
export const bloggerIdBodyValidator = body('bloggerId').isString().withMessage("bloggerIdBodyValidator")

export const nameValidation = body("name").trim().isLength({
  min: 1,
  max: 15
}).withMessage("Name must be >1 and <15 characters.")
export const bloggerIdParamsValidation = param('bloggerId').isString().withMessage('param bloggerId must string')
const userIdBodyRegExp = /^\d+$/i
export const userIdParamsValidation = param('userId').matches(userIdBodyRegExp).withMessage('param userId must be Int')
const youtubeUrlRegExp = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'
export const validatorUrl = body("youtubeUrl").trim().matches(youtubeUrlRegExp).isLength({
  min: 0,
  max: 100
}).withMessage("\"youtubeUrl2 should be maxLength=100 or matched to pattern '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'")

//users validator
export const bodyLogin = body(['login']).isString().withMessage('Login must be string').isLength({
  min: 3,
  max: 10
}).withMessage("bodyLogin must be >3 and <10 characters.")
export const bodyPassword = body(['password']).trim().isString().withMessage('Password must be string').isLength({
  min: 6,
  max: 20
}).withMessage("bodyPassword must be >6 and <20 characters.")
const emailRegExp = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
export const bodyEmail = body(['email']).matches(emailRegExp).withMessage("Email should be matched to pattern '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'")
export const bodyCode = body(['code']).trim().isString().withMessage('Code must be string')

//usersAccount
export const bodyLoginUsersAccount = body(['login']).isString().withMessage('Login must be string')
export const bodyPasswordUsersAccount = body(['password']).isString().withMessage('Password must be string')
export const contentCommentValidation = body("content").trim().isLength({
  min: 20,
  max: 300
}).withMessage("content must be >20 and <300 characters.")

// Blog
export const nameBlogValidation = body("name").trim().isString()
export const youtubeUrlBlogValidation = body("youtubeUrl").trim().isString()
export const titleBlogValidation = body("title").trim().isString().isLength({
  min: 1,
  max: 30
}).withMessage("title must be >1 and <30 characters.")
export const shortDescriptionBlogValidation = body("shortDescription").trim().isLength({
  min: 1,
  max: 100
}).withMessage("shortDescription must be >1 and <1000 characters.")
export const contentBlogValidation = body("content").trim().isLength({
  min: 1,
  max: 1000
}).withMessage("content must be >1 and <1000 characters.")
export const blogIdParamsValidation = param('blogId').isString().withMessage("blogIdParamsValidation5")
export const idParamsValidation = param('id').isString()

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