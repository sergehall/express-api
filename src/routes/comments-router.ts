import {Router} from "express";
import {ioc} from "../IoCContainer";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
  contentCommentValidation,
  inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";


export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
  ioc.commentsController.getCommentsById.bind(ioc.commentsController))

  .put('/:commentId', authMiddleware, contentCommentValidation, inputValidatorMiddleware,
    ioc.commentsController.updateCommentsById.bind(ioc.commentsController))

  .delete('/:commentId', authMiddleware,
    ioc.commentsController.deleteCommentsById.bind(ioc.commentsController))