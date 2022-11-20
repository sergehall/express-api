import {FeedbacksService} from "../domain/feedbacks-service";
import {Request, Response} from "express";


export class FeedbacksController {
  constructor(private feedbacksService: FeedbacksService) {
  }

  async getAllFeedbacks(req: Request, res: Response) {
    const allFeedbacks = await this.feedbacksService.allFeedbacks()
    res.send(allFeedbacks)
  }

  async createFeedback(req: Request, res: Response) {
    const user = req.user
    if(!user){
      return res.sendStatus(403)
    }

    const userIdParams = req.params.userId;
    const userIdAuth = user.accountData.id

    if (userIdParams !== userIdAuth) {
      return res.sendStatus(403)
    }
    const newFeedback = await this.feedbacksService.sendFeedback(userIdParams, req.body.comment)
    if (newFeedback.resultCode !== 0) {
      return res.status(400).send(newFeedback.errorsMessages)
    }
    res.status(201).send(newFeedback.data)
  }
}