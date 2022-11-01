import {ArrayErrorsType, FeedbackDBType, ReturnTypeObjectFeedback} from "../types/all_types";
import {MyModelFeedbacks} from "../mongoose/FeedbacksSchemaModel";
import uuid4 from "uuid4";
import {MongoHasNotUpdated} from "../middlewares/errorsMessages";


export class FeedbacksRepository{
  async createFeedback(userId: string, comment: string): Promise<ReturnTypeObjectFeedback> {
    const errorsArray: ArrayErrorsType = [];
    const foundUserId = await MyModelFeedbacks.findOne({id: userId})
    if (!foundUserId) {
      const newFeedback = {id: userId, allFeedbacks: [{commentId: uuid4().toString(), comment: comment}]};
      await MyModelFeedbacks.create(newFeedback);
      return {
        data: newFeedback,
        errorsMessages: errorsArray,
        resultCode: 0
      }

    } else {
      const newFeedback = {commentId: uuid4().toString(), comment: comment}
      const updateFeedback: FeedbackDBType = await MyModelFeedbacks.findOneAndUpdate(
        {id: userId},
        {$push: {allFeedbacks: newFeedback}},
        {upsert: true, returnDocument: "after", projection: {_id: false, __v: false, "allFeedbacks._id": false}})
      if(!updateFeedback) {
        errorsArray.push(MongoHasNotUpdated)
        return {
          data: null,
          errorsMessages: errorsArray,
          resultCode: 1
        }
      }
      return {
        data: updateFeedback,
        errorsMessages: errorsArray,
        resultCode: 0
      }
    }
  }
  async getAllFeedbacks(): Promise<FeedbackDBType[]> {
    return MyModelFeedbacks.find(
      {},
      {_id: false, __v: false, "allFeedbacks._id": false}).lean()
  }
}