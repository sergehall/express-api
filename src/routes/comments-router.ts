import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  contentCommentValidation, inputValidatorMiddleware, likeStatusValidator
} from "../middlewares/input-validator-middleware";


export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
  ioc.authCheckUserAuthorizationForUserAccount.noneStatus,
  ioc.commentsController.getCommentById.bind(ioc.commentsController))

  .put('/:commentId',
    ioc.authCheckUserAuthorizationForUserAccount.authCheck,
    ioc.comparingLoginAndOwnersComment.comparing,
    contentCommentValidation, inputValidatorMiddleware,
    ioc.commentsController.updateCommentsById.bind(ioc.commentsController))

  .put('/:commentId/like-status',
    ioc.authCheckUserAuthorizationForUserAccount.authCheck,
    likeStatusValidator,
    inputValidatorMiddleware,
    ioc.commentsController.likeStatusCommentId.bind(ioc.commentsController))

  .delete('/:commentId',
    ioc.authCheckUserAuthorizationForUserAccount.authCheck,
    ioc.comparingLoginAndOwnersComment.comparing,
    ioc.commentsController.deleteCommentsById.bind(ioc.commentsController))