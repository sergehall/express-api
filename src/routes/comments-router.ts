import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  contentCommentValidation, inputValidatorMiddleware, likeStatusValidator
} from "../middlewares/input-validator-middleware";
import {container} from "../Container";
import {CommentsController} from "../presentation/commentsController";


export const commentsRouter = Router({})

const commentsController = container.resolve<CommentsController>(CommentsController)

commentsRouter.get('/:commentId',
  ioc.auth.noneStatusAccessToken,
  commentsController.findCommentByCommentId.bind(commentsController))

  .put('/:commentId',
    ioc.auth.authenticationAccessToken,
    ioc.auth.compareCurrentAndCreatorComment,
    contentCommentValidation, inputValidatorMiddleware,
    commentsController.updateCommentsById.bind(commentsController))

  .put('/:commentId/like-status',
    ioc.auth.authenticationAccessToken,
    likeStatusValidator,
    inputValidatorMiddleware,
    commentsController.likeStatusCommentId.bind(commentsController))

  .delete('/:commentId',
    ioc.auth.authenticationAccessToken,
    ioc.auth.compareCurrentAndCreatorComment,
    commentsController.deleteCommentsById.bind(commentsController))