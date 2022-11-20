import {Router} from "express";
import {
  contentValidation,
  postIdParamsValidation,
  inputValidatorMiddleware,
  shortDescriptionValidation,
  titleValidation,
  contentCommentValidation,
  likeStatusValidator, blogIdBodyValidator,
} from "../middlewares/input-validator-middleware";
import {ioc} from "../IoCContainer";


export const postsRouts = Router({})

postsRouts.get('/',
  ioc.auth.noneStatusAccessToken,
  ioc.postsController.getAllPosts.bind(ioc.postsController))

  .post('/',
    ioc.auth.basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdBodyValidator,
    inputValidatorMiddleware,
    ioc.postsController.createPost.bind(ioc.postsController))

  .get('/:postId',
    ioc.auth.noneStatusAccessToken,
    postIdParamsValidation,
    inputValidatorMiddleware,
    ioc.postsController.getPostById.bind(ioc.postsController))

  .put('/:postId',
    ioc.auth.basicAuthorization,
    postIdParamsValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdBodyValidator,
    inputValidatorMiddleware,
    ioc.postsController.updatePostById.bind(ioc.postsController))

  .delete('/:postId',
    ioc.auth.basicAuthorization,
    postIdParamsValidation,
    inputValidatorMiddleware,
    ioc.postsController.deletePostById.bind(ioc.postsController))

  .delete('/',
    ioc.auth.basicAuthorization,
    ioc.postsController.deleteAllPosts.bind(ioc.postsController))

  .get('/:postId/comments',
    ioc.auth.noneStatusAccessToken,
    postIdParamsValidation,
    inputValidatorMiddleware,
    ioc.postsController.getCommentsByPostId.bind(ioc.postsController))

  .post('/:postId/comments',
    ioc.auth.authenticationAccessToken,
    contentCommentValidation,
    inputValidatorMiddleware,
    ioc.postsController.createNewCommentByPostId.bind(ioc.postsController))

  .put('/:postId/like-status',
    ioc.auth.authenticationAccessToken,
    postIdParamsValidation,
    likeStatusValidator,
    inputValidatorMiddleware,
    ioc.postsController.likeStatusPostId.bind(ioc.postsController))