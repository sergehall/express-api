import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bloggerIdParamsValidation, contentValidation,
  inputValidatorMiddleware,
  nameValidation, shortDescriptionValidation, titleValidation, validatorUrl,
} from "../middlewares/input-validator-middleware";
import {authMiddlewareHeadersAuthorization} from "../middlewares/auth-middleware";


export const bloggersRouts = Router({})


bloggersRouts.get('/',
  ioc.bloggersController.getAllBloggers.bind(ioc.bloggersController))

  .post('/', authMiddlewareHeadersAuthorization,
    nameValidation, validatorUrl, inputValidatorMiddleware,
    ioc.bloggersController.createNewBlogger.bind(ioc.bloggersController))

  .get('/:bloggerId', bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.getBloggerById.bind(ioc.bloggersController))

  .put('/:bloggerId', authMiddlewareHeadersAuthorization,
    bloggerIdParamsValidation, nameValidation, validatorUrl, inputValidatorMiddleware,
    ioc.bloggersController.updateBloggerById.bind(ioc.bloggersController))

  .delete('/:bloggerId', authMiddlewareHeadersAuthorization,
    bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.deleteBloggerById.bind(ioc.bloggersController))

  .get('/:bloggerId/posts', bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.getAllPostByBloggerId.bind(ioc.bloggersController))

  .post('/:bloggerId/posts', authMiddlewareHeadersAuthorization,
    bloggerIdParamsValidation, titleValidation, shortDescriptionValidation,
    contentValidation, inputValidatorMiddleware,
    ioc.bloggersController.createPostByBloggerId.bind(ioc.bloggersController))