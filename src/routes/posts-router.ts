import {Router} from "express";
import {
  contentValidation,
  postIdParamsValidation,
  inputValidatorMiddleware,
  shortDescriptionValidation,
  titleValidation,
  bloggerIdBodyValidator,
  contentCommentValidation
} from "../middlewares/input-validator-middleware";
import {ioc} from "../IoCContainer";
import {authCheckUserAuthorization, authMiddlewareBasicAuthorization} from "../middlewares/auth-middleware";




export const postsRouts = Router({})

postsRouts.get('/',
  ioc.postsController.getAllPosts.bind(ioc.postsController))

  .post('/', authMiddlewareBasicAuthorization,
    titleValidation, shortDescriptionValidation, contentValidation,
    bloggerIdBodyValidator, inputValidatorMiddleware,
    ioc.postsController.createNewPost.bind(ioc.postsController))

  .get('/:postId', postIdParamsValidation, inputValidatorMiddleware,
    ioc.postsController.getPostById.bind(ioc.postsController))

  .put('/:postId', authMiddlewareBasicAuthorization,
    postIdParamsValidation, titleValidation, shortDescriptionValidation,
    contentValidation, bloggerIdBodyValidator, inputValidatorMiddleware,
    ioc.postsController.updatePostById.bind(ioc.postsController))

  .delete('/:postId', authMiddlewareBasicAuthorization,
    postIdParamsValidation, inputValidatorMiddleware,
    ioc.postsController.deletePostById.bind(ioc.postsController))

  .delete('/', authMiddlewareBasicAuthorization,
    ioc.postsController.deleteAllPosts.bind(ioc.postsController))

  .get('/:postId/comments', postIdParamsValidation, inputValidatorMiddleware,
    ioc.postsController.getCommentsByPostId.bind(ioc.postsController))

  .post('/:postId/comments', authCheckUserAuthorization, contentCommentValidation, inputValidatorMiddleware,
    ioc.postsController.createNewCommentByPostId.bind(ioc.postsController))