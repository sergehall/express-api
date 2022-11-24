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
import {PostsController} from "../presentation/postsController";
import {AuthMiddlewares} from "../middlewares/auth";


export const postsRouts = Router({})

const postsController = container.resolve<PostsController>(PostsController)
const authMiddlewares = container.resolve<AuthMiddlewares>(AuthMiddlewares)

postsRouts.get('/',
  authMiddlewares.noneStatusAccessToken,
  postsController.getAllPosts.bind(postsController))

  .post('/',
    authMiddlewares.basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdBodyValidator,
    inputValidatorMiddleware,
    postsController.createPost.bind(postsController))

  .get('/:postId',
    authMiddlewares.noneStatusAccessToken,
    postIdParamsValidation,
    inputValidatorMiddleware,
    postsController.getPostById.bind(postsController))

  .put('/:postId',
    authMiddlewares.basicAuthorization,
    postIdParamsValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdBodyValidator,
    inputValidatorMiddleware,
    postsController.updatePostById.bind(postsController))

  .delete('/:postId',
    authMiddlewares.basicAuthorization,
    postIdParamsValidation,
    inputValidatorMiddleware,
    postsController.deletePostById.bind(postsController))

  .delete('/',
    authMiddlewares.basicAuthorization,
    postsController.deleteAllPosts.bind(postsController))

  .get('/:postId/comments',
    authMiddlewares.noneStatusAccessToken,
    postIdParamsValidation,
    inputValidatorMiddleware,
    postsController.getCommentsByPostId.bind(postsController))

  .post('/:postId/comments',
    authMiddlewares.authenticationAccessToken,
    contentCommentValidation,
    inputValidatorMiddleware,
    postsController.createNewCommentByPostId.bind(postsController))

  .put('/:postId/like-status',
    authMiddlewares.authenticationAccessToken,
    postIdParamsValidation,
    likeStatusValidator,
    inputValidatorMiddleware,
    postsController.likeStatusPostId.bind(postsController))