import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  contentCommentValidation, inputValidatorMiddleware, likeStatusValidator
} from "../middlewares/input-validator-middleware";


export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
  ioc.auth.noneStatusRefreshToken,
  ioc.commentsController.getCommentById.bind(ioc.commentsController))

  .put('/:commentId',
    ioc.auth.authentication,
    ioc.auth.compareCurrentAndCreatorComment,
    contentCommentValidation, inputValidatorMiddleware,
    ioc.commentsController.updateCommentsById.bind(ioc.commentsController))

  .put('/:commentId/like-status',
    ioc.auth.authentication,
    likeStatusValidator,
    inputValidatorMiddleware,
    ioc.commentsController.likeStatusCommentId.bind(ioc.commentsController))

  .delete('/:commentId',
    ioc.auth.authentication,
    ioc.auth.compareCurrentAndCreatorComment,
    ioc.commentsController.deleteCommentsById.bind(ioc.commentsController))