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



export const bloggersRouts = Router({})


bloggersRouts.get('/',
  ioc.bloggersController.getAllBloggers.bind(ioc.bloggersController))

  .post('/', ioc.auth.basicAuthorization,
    nameValidation, validatorUrl, inputValidatorMiddleware,
    ioc.bloggersController.createNewBlogger.bind(ioc.bloggersController))

  .get('/:bloggerId', bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.getBloggerById.bind(ioc.bloggersController))

  .put('/:bloggerId', ioc.auth.basicAuthorization,
    bloggerIdParamsValidation, nameValidation, validatorUrl, inputValidatorMiddleware,
    ioc.bloggersController.updateBloggerById.bind(ioc.bloggersController))

  .delete('/', ioc.auth.basicAuthorization,
    ioc.bloggersController.deleteAllBloggers.bind(ioc.bloggersController))

  .delete('/:bloggerId', ioc.auth.basicAuthorization,
    bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.deleteBloggerById.bind(ioc.bloggersController))

  .get('/:bloggerId/posts',   ioc.auth.noneStatus,
    bloggerIdParamsValidation, inputValidatorMiddleware,
    ioc.bloggersController.getAllPostByBloggerId.bind(ioc.bloggersController))

  .post('/:bloggerId/posts', ioc.auth.basicAuthorization,
    bloggerIdParamsValidation, titleValidation, shortDescriptionValidation,
    contentValidation, inputValidatorMiddleware,
    ioc.bloggersController.createPostByBloggerId.bind(ioc.bloggersController))