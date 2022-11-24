import {Router} from "express";
import {
  inputValidatorMiddleware,
  userIdParamsValidation
} from "../middlewares/input-validator-middleware";
import {container} from "../Container";
import {FeedbacksController} from "../presentation/feedbacksController";
import {AuthMiddlewares} from "../middlewares/auth";


export const feedbacksRouter = Router({})

const feedbacksController = container.resolve<FeedbacksController>(FeedbacksController)
const auth = container.resolve<AuthMiddlewares>(AuthMiddlewares)

feedbacksRouter.get('/',
  feedbacksController.getAllFeedbacks.bind(feedbacksController))

  .post('/:userId',
    auth.authenticationAccessToken,
    userIdParamsValidation,
    inputValidatorMiddleware,
    feedbacksController.createFeedback.bind(feedbacksController))
