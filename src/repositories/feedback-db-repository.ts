import {
  Feedback,
  FeedbacksTypeModel,
} from "../types/tsTypes";
import {MyModelFeedbacks} from "../mongoose/FeedbacksSchemaModel";
import {injectable} from "inversify";


@injectable()
export class FeedbacksRepository {

  async createFeedback(userId: string, newFeedback: Feedback): Promise<Boolean> {
    return await MyModelFeedbacks.findOneAndUpdate(
      {id: userId},
      {
        $push: {
          allFeedbacks: newFeedback
        }
      },
      {
        upsert: true,
        returnDocument: "after",
        projection: {_id: false, __v: false, "allFeedbacks._id": false}
      })
  }

  async getAllFeedbacks(): Promise<FeedbacksTypeModel> {
    return await MyModelFeedbacks.find(
      {},
      {_id: false, __v: false, "allFeedbacks._id": false}).lean()
  }
}