import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  contentCommentValidation, inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";
import {comparingLoginAndOwnersComment} from "../middlewares/comparison-login-and-owner-comment";
import {
  authCheckUserAuthorizationForUserAccount
} from "../middlewares/auth-Basic-User-authorization";


export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
  ioc.commentsController.getCommentById.bind(ioc.commentsController))

  .put('/:commentId', authCheckUserAuthorizationForUserAccount, comparingLoginAndOwnersComment, contentCommentValidation, inputValidatorMiddleware,
    ioc.commentsController.updateCommentsById.bind(ioc.commentsController))

  .delete('/:commentId', authCheckUserAuthorizationForUserAccount, comparingLoginAndOwnersComment,
    ioc.commentsController.deleteCommentsById.bind(ioc.commentsController))