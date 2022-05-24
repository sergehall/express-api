import {Router} from "express";
import {ioc} from "../IoCContainer";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
  contentCommentValidation,
  inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";
import {comparingLoginAndOwnersComment} from "../middlewares/comparison-login-and-owner-comment";



export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
  ioc.commentsController.getCommentById.bind(ioc.commentsController))

  .put('/:commentId', authMiddleware, comparingLoginAndOwnersComment, contentCommentValidation, inputValidatorMiddleware,
    ioc.commentsController.updateCommentsById.bind(ioc.commentsController))

  .delete('/:commentId', authMiddleware,
    ioc.commentsController.deleteCommentsById.bind(ioc.commentsController))