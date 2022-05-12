import {Router} from "express";
import {ioc} from "../IoCContainer";


export const feedbacksRouter = Router({})

feedbacksRouter.get('/',
  ioc.feedbacksController.getAllFeedbacks.bind(ioc.feedbacksController))

  .post('/:userId',
    ioc.feedbacksController.createFeedback.bind(ioc.feedbacksController))
