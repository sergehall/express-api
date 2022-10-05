import {Router} from "express";
import {
  contentValidation,
  postIdParamsValidation,
  inputValidatorMiddleware,
  shortDescriptionValidation,
  titleValidation,
  bloggerIdBodyValidator,
  contentCommentValidation, likeStatusValidator, bloggerIdBodyValidator2
} from "../middlewares/input-validator-middleware";
import {ioc} from "../IoCContainer";


export const postsRouts = Router({})

postsRouts.get('/',
  ioc.postsController.getAllPosts.bind(ioc.postsController))

  .post('/',
    ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    titleValidation, shortDescriptionValidation, contentValidation,
    bloggerIdBodyValidator, inputValidatorMiddleware,
    ioc.postsController.createNewPost.bind(ioc.postsController))

  .get('/:postId',
    ioc.authCheckUserAuthorizationForUserAccount.noneStatus,
    postIdParamsValidation,
    inputValidatorMiddleware,
    ioc.postsController.getPostById.bind(ioc.postsController))

  .put('/:postId',
    ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    postIdParamsValidation, titleValidation, shortDescriptionValidation,
    contentValidation, bloggerIdBodyValidator2,
    inputValidatorMiddleware,
    ioc.postsController.updatePostById.bind(ioc.postsController))

  .delete('/:postId',
    ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    postIdParamsValidation,
    inputValidatorMiddleware,
    ioc.postsController.deletePostById.bind(ioc.postsController))

  .delete('/',
    ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    ioc.postsController.deleteAllPosts.bind(ioc.postsController))

  .get('/:postId/comments',
    postIdParamsValidation,
    inputValidatorMiddleware,
    ioc.postsController.getCommentsByPostId.bind(ioc.postsController))

  .post('/:postId/comments',
    ioc.authCheckUserAuthorizationForUserAccount.authCheck,
    contentCommentValidation,
    inputValidatorMiddleware,
    ioc.postsController.createNewCommentByPostId.bind(ioc.postsController))

  .put('/:postId/like-status',
    ioc.authCheckUserAuthorizationForUserAccount.authCheck,
    postIdParamsValidation,
    likeStatusValidator,
    inputValidatorMiddleware,
    ioc.postsController.likeStatusPostId.bind(ioc.postsController))