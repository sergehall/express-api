import {FeedbacksService} from "../domain/feedbacks-service";
import {Request, Response} from "express";


export class FeedbacksController {
  constructor(protected feedbacksService: FeedbacksService) {
  }

  async getAllFeedbacks(req: Request, res: Response) {
    const allFeedbacks = await this.feedbacksService.allFeedbacks()
    res.send(allFeedbacks)
  }

  async createFeedback(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = req.user

    if(!user){
      return res.sendStatus(401)
    }

    const newFeedback = await this.feedbacksService.sendFeedback(userId, req.body.comment)
    if (!newFeedback.data) {
      return res.status(400).send(newFeedback.errorsMessages)
    }
    res.status(201).send(newFeedback.data[0])
  }
}