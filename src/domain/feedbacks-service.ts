import {FeedbacksTypeModel, ReturnTypeObjectFeedback} from "../types/tsTypes";
import {FeedbacksRepository} from "../repositories/feedback-db-repository";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";

@injectable()
export class FeedbacksService {
  constructor(@inject(TYPES.FeedbacksRepository) protected feedbacksRepository: FeedbacksRepository) {
  }
  async  allFeedbacks(): Promise<FeedbacksTypeModel> {
    return await this.feedbacksRepository.getAllFeedbacks()
  }
  async sendFeedback(userId: string, comment: string): Promise<ReturnTypeObjectFeedback> {
    return  await this.feedbacksRepository.createFeedback(userId, comment)
  }
}