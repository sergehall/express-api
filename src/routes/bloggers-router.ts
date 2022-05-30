import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bloggerIdParamsValidation,
  contentValidation,
  inputValidatorMiddleware,
  nameValidation,
  shortDescriptionValidation,
  titleValidation,
  validatorUrl,
} from "../middlewares/input-validator-middleware";
import {authMiddlewareBasicAuthorization} from "../middlewares/auth-Basic-User-authorization";



export const bloggersRouts = Router({})


bloggersRouts.get('/',
  ioc.bloggersController.getAllBloggers.bind(ioc.bloggersController))

  .post('/', authMiddlewareBasicAuthorization,
    nameValidation, validatorUrl, inputValidatorMiddleware,
    ioc.bloggersController.createNewBlogger.bind(ioc.bloggersController))

  .get('/:bloggerId', bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.getBloggerById.bind(ioc.bloggersController))

  .put('/:bloggerId', authMiddlewareBasicAuthorization,
    bloggerIdParamsValidation, nameValidation, validatorUrl, inputValidatorMiddleware,
    ioc.bloggersController.updateBloggerById.bind(ioc.bloggersController))

  .delete('/', authMiddlewareBasicAuthorization,
    ioc.bloggersController.deleteAllBloggers.bind(ioc.bloggersController))

  .delete('/:bloggerId', authMiddlewareBasicAuthorization,
    bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.deleteBloggerById.bind(ioc.bloggersController))

  .get('/:bloggerId/posts', bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.getAllPostByBloggerId.bind(ioc.bloggersController))

  .post('/:bloggerId/posts', authMiddlewareBasicAuthorization,
    bloggerIdParamsValidation, titleValidation, shortDescriptionValidation,
    contentValidation, inputValidatorMiddleware,
    ioc.bloggersController.createPostByBloggerId.bind(ioc.bloggersController))