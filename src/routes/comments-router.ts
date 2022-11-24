import {Router} from "express";
import {
  contentCommentValidation, inputValidatorMiddleware, likeStatusValidator
} from "../middlewares/input-validator-middleware";
import {container} from "../Container";
import {CommentsController} from "../presentation/commentsController";
import {Auth} from "../middlewares/auth";


export const commentsRouter = Router({})

const commentsController = container.resolve<CommentsController>(CommentsController)
const auth = container.resolve<Auth>(Auth)

commentsRouter.get('/:commentId',
  auth.noneStatusAccessToken,
  commentsController.findCommentByCommentId.bind(commentsController))

  .put('/:commentId',
    auth.authenticationAccessToken,
    auth.compareCurrentAndCreatorComment,
    contentCommentValidation, inputValidatorMiddleware,
    commentsController.updateCommentsById.bind(commentsController))

  .put('/:commentId/like-status',
    auth.authenticationAccessToken,
    likeStatusValidator,
    inputValidatorMiddleware,
    commentsController.likeStatusCommentId.bind(commentsController))

  .delete('/:commentId',
    auth.authenticationAccessToken,
    auth.compareCurrentAndCreatorComment,
    commentsController.deleteCommentsById.bind(commentsController))