import {Router} from "express";
import {ioc} from "../IoCContainer";
import {authCheckUserAuthorization} from "../middlewares/auth-middleware";
import {
  contentCommentValidation, inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";
import {comparingLoginAndOwnersComment} from "../middlewares/comparison-login-and-owner-comment";


export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
  ioc.commentsController.getCommentById.bind(ioc.commentsController))

  .put('/:commentId', authCheckUserAuthorization, comparingLoginAndOwnersComment, contentCommentValidation, inputValidatorMiddleware,
    ioc.commentsController.updateCommentsById.bind(ioc.commentsController))

  .delete('/:commentId', authCheckUserAuthorization, comparingLoginAndOwnersComment,
    ioc.commentsController.deleteCommentsById.bind(ioc.commentsController))