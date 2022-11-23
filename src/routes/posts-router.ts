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
import {container} from "../Container";
import {ioc} from "../IoCContainer";
import {PostsController} from "../presentation/postsController";


export const postsRouts = Router({})

const postsController = container.resolve<PostsController>(PostsController)

postsRouts.get('/',
  ioc.auth.noneStatusAccessToken,
  postsController.getAllPosts.bind(postsController))

  .post('/',
    ioc.auth.basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdBodyValidator,
    inputValidatorMiddleware,
    postsController.createPost.bind(postsController))

  .get('/:postId',
    ioc.auth.noneStatusAccessToken,
    postIdParamsValidation,
    inputValidatorMiddleware,
    postsController.getPostById.bind(postsController))

  .put('/:postId',
    ioc.auth.basicAuthorization,
    postIdParamsValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdBodyValidator,
    inputValidatorMiddleware,
    postsController.updatePostById.bind(postsController))

  .delete('/:postId',
    ioc.auth.basicAuthorization,
    postIdParamsValidation,
    inputValidatorMiddleware,
    postsController.deletePostById.bind(postsController))

  .delete('/',
    ioc.auth.basicAuthorization,
    postsController.deleteAllPosts.bind(postsController))

  .get('/:postId/comments',
    ioc.auth.noneStatusAccessToken,
    postIdParamsValidation,
    inputValidatorMiddleware,
    postsController.getCommentsByPostId.bind(postsController))

  .post('/:postId/comments',
    ioc.auth.authenticationAccessToken,
    contentCommentValidation,
    inputValidatorMiddleware,
    postsController.createNewCommentByPostId.bind(postsController))

  .put('/:postId/like-status',
    ioc.auth.authenticationAccessToken,
    postIdParamsValidation,
    likeStatusValidator,
    inputValidatorMiddleware,
    postsController.likeStatusPostId.bind(postsController))