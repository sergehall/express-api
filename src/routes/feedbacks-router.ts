import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  inputValidatorMiddleware,
  userIdParamsValidation
} from "../middlewares/input-validator-middleware";


export const feedbacksRouter = Router({})

feedbacksRouter.get('/',
  ioc.feedbacksController.getAllFeedbacks.bind(ioc.feedbacksController))

  .post('/:userId',
    ioc.auth.authenticationAccessToken,
    userIdParamsValidation,
    inputValidatorMiddleware,
    ioc.feedbacksController.createFeedback.bind(ioc.feedbacksController))
