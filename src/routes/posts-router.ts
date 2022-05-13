import {Router} from "express";
import {
  contentValidation, postIdParamsValidation, inputValidatorMiddleware,
  shortDescriptionValidation, titleValidation, bloggerIdBodyValidator, bloggerIdParamsValidation
} from "../middlewares/input-validator-middleware";
import {ioc} from "../IoCContainer";
import {authMiddlewareHeadersAuthorization} from "../middlewares/auth-middleware";




export const postsRouts = Router({})

postsRouts.get('/',
  ioc.postsController.getAllPosts.bind(ioc.postsController))

  .post('/', authMiddlewareHeadersAuthorization,
    titleValidation, shortDescriptionValidation, contentValidation,
    bloggerIdBodyValidator, inputValidatorMiddleware,
    ioc.postsController.createNewPost.bind(ioc.postsController))

  .get('/:postId', postIdParamsValidation, inputValidatorMiddleware,
    ioc.postsController.getPostById.bind(ioc.postsController))

  .put('/:postId', authMiddlewareHeadersAuthorization,
    postIdParamsValidation, titleValidation, shortDescriptionValidation,
    contentValidation, bloggerIdBodyValidator, inputValidatorMiddleware,
    ioc.postsController.updatePostById.bind(ioc.postsController))

  .delete('/:postId', authMiddlewareHeadersAuthorization,
    postIdParamsValidation, inputValidatorMiddleware,
    ioc.postsController.deletePostById.bind(ioc.postsController))