import {ArrayErrorsType, FeedbacksTypeModel, ReturnTypeObjectFeedback} from "../types/types";
import {MyModelFeedbacks} from "../mongoose/FeedbacksSchemaModel";
import uuid4 from "uuid4";


export class FeedbacksRepository {
  async createFeedback(userId: string, comment: string): Promise<ReturnTypeObjectFeedback> {
    const errorsArray: ArrayErrorsType = [];
    const newFeedback: FeedbacksTypeModel = await MyModelFeedbacks.findOneAndUpdate(
      {id: userId},
      {
        $push: {
          allFeedbacks:
            {
              commentId: uuid4().toString(),
              comment: comment
            }
        }
      },
      {
        upsert: true,
        returnDocument: "after",
        projection: {_id: false, __v: false, "allFeedbacks._id": false}
      })
    return {
      data: newFeedback,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async getAllFeedbacks(): Promise<FeedbacksTypeModel> {
    return await MyModelFeedbacks.find(
      {},
      {_id: false, __v: false, "allFeedbacks._id": false}).lean()
  }
}