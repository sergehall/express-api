import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  inputValidatorMiddleware,
  userIdParamsValidation
} from "../middlewares/input-validator-middleware";
import {container} from "../Container";
import {FeedbacksController} from "../presentation/feedbacksController";


export const feedbacksRouter = Router({})

const feedbacksController = container.resolve<FeedbacksController>(FeedbacksController)

feedbacksRouter.get('/',
  feedbacksController.getAllFeedbacks.bind(feedbacksController))

  .post('/:userId',
    ioc.auth.authenticationAccessToken,
    userIdParamsValidation,
    inputValidatorMiddleware,
    feedbacksController.createFeedback.bind(feedbacksController))
