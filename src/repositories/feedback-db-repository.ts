import {ArrayErrorsType, FeedbacksTypeModel, ReturnTypeObjectFeedback} from "../types/types";
import {MyModelFeedbacks} from "../mongoose/FeedbacksSchemaModel";
import uuid4 from "uuid4";
import {mongoHasNotUpdated, notFoundUserId} from "../middlewares/errorsMessages";
import {MyModelUser} from "../mongoose/UsersSchemaModel";


export class FeedbacksRepository {

  async createFeedback(userId: string, comment: string): Promise<ReturnTypeObjectFeedback> {
    let errorsArray: ArrayErrorsType = [];
    if (!await MyModelUser.findOne({"accountData.id": userId})) {
      errorsArray.push(notFoundUserId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const newComment = {
      commentId: uuid4().toString(),
      comment: comment
    }

    const newFeedback: FeedbacksTypeModel = await MyModelFeedbacks.findOneAndUpdate(
      {id: userId},
      {
        $push: {
          allFeedbacks: newComment
        }
      },
      {
        upsert: true,
        returnDocument: "after",
        projection: {_id: false, __v: false, "allFeedbacks._id": false}
      })

    if (!newFeedback) {
      errorsArray.push(mongoHasNotUpdated)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    return {
      data: [newComment],
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