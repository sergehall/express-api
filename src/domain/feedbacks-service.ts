import {ArrayErrorsType, FeedbacksTypeModel, ReturnTypeObjectFeedback} from "../types/tsTypes";
import {FeedbacksRepository} from "../repositories/feedback-db-repository";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/types";
import {UsersRepository} from "../repositories/users-db-repository";
import {mongoHasNotUpdated, notFoundUserId} from "../middlewares/errorsMessages";
import uuid4 from "uuid4";

@injectable()
export class FeedbacksService {
  constructor(@inject(TYPES.FeedbacksRepository) protected feedbacksRepository: FeedbacksRepository,
              @inject(TYPES.UsersRepository) protected usersRepository: UsersRepository) {
  }
  async  allFeedbacks(): Promise<FeedbacksTypeModel> {
    return await this.feedbacksRepository.getAllFeedbacks()
  }
  async createFeedback(userId: string, comment: string): Promise<ReturnTypeObjectFeedback> {
    let errorsArray: ArrayErrorsType = [];
    const newFeedback = {
      commentId: uuid4().toString(),
      comment: comment
    }
    const user = await this.usersRepository.findUserByUserId(userId)
    if (!user) {
      errorsArray.push(notFoundUserId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    const createFeedback = this.feedbacksRepository.createFeedback(userId, newFeedback)
    if (!createFeedback) {
      errorsArray.push(mongoHasNotUpdated)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: [newFeedback],
      errorsMessages: errorsArray,
      resultCode: 1
    }
  }
}