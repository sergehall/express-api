import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  contentCommentValidation, inputValidatorMiddleware, likeStatusValidator
} from "../middlewares/input-validator-middleware";


export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
  ioc.auth.noneStatusAccessToken,
  ioc.commentsController.findCommentByCommentId.bind(ioc.commentsController))

  .put('/:commentId',
    ioc.auth.authenticationAccessToken,
    ioc.auth.compareCurrentAndCreatorComment,
    contentCommentValidation, inputValidatorMiddleware,
    ioc.commentsController.updateCommentsById.bind(ioc.commentsController))

  .put('/:commentId/like-status',
    ioc.auth.authenticationAccessToken,
    likeStatusValidator,
    inputValidatorMiddleware,
    ioc.commentsController.likeStatusCommentId.bind(ioc.commentsController))

  .delete('/:commentId',
    ioc.auth.authenticationAccessToken,
    ioc.auth.compareCurrentAndCreatorComment,
    ioc.commentsController.deleteCommentsById.bind(ioc.commentsController))