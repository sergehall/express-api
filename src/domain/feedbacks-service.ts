import {ObjectId} from "mongodb";
import {FeedbackDBType} from "../types/all_types";
import {FeedbacksRepository} from "../repositories/feedback-db-repository";


export class FeedbacksService {
  constructor(private feedbacksRepository: FeedbacksRepository) {
    this.feedbacksRepository = feedbacksRepository
  }
  async  allFeedbacks(): Promise<FeedbackDBType[]> {
    return await this.feedbacksRepository.getAllFeedbacks()
  }
  async sendFeedback(comment: string, userId: ObjectId): Promise<FeedbackDBType> {
    return  await this.feedbacksRepository.createFeedback(userId, comment)
  }
}