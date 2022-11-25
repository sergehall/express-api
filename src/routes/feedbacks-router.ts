import {Router} from "express";
import {
  inputValidatorMiddleware,
  userIdParamsValidation
} from "../middlewares/input-validator-middleware";
import {myContainer} from "../types/container";
import {FeedbacksController} from "../presentation/feedbacksController";
import {AuthMiddlewares} from "../middlewares/authMiddlewares";


export const feedbacksRouter = Router({})

const feedbacksController = myContainer.resolve<FeedbacksController>(FeedbacksController)
const authMiddlewares = myContainer.resolve<AuthMiddlewares>(AuthMiddlewares)

feedbacksRouter.get('/',
  feedbacksController.getAllFeedbacks.bind(feedbacksController))

  .post('/:userId',
    authMiddlewares.authenticationAccessToken,
    userIdParamsValidation,
    inputValidatorMiddleware,
    feedbacksController.createFeedback.bind(feedbacksController))
