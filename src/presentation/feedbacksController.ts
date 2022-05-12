import {FeedbacksService} from "../domain/feedbacks-service";
import {Request, Response} from "express";
import {ObjectId} from "mongodb";



export class FeedbacksController {
  constructor(private feedbacksService: FeedbacksService) {
  }
  async getAllFeedbacks(req: Request, res: Response) {
    const allFeedbacks = await this.feedbacksService.allFeedbacks()
    res.send(allFeedbacks)
  }
  async createFeedback(req: Request, res: Response) {
    const userId = new ObjectId(req.params.userId)
    const newProduct = await this.feedbacksService.sendFeedback(req.body.comment, userId)
    res.status(201).send(newProduct.allFeedbacks)
  }
}