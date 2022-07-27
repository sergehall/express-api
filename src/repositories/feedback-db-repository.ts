import {ObjectId} from "mongodb";
import {FeedbackDBType} from "../types/all_types";
import {MyModelFeedbacks} from "../mongoose/FeedbacksSchemaModel";


export class FeedbacksRepository{
  async createFeedback(userId: ObjectId, comment: string): Promise<FeedbackDBType> {

    const foundUserId = await MyModelFeedbacks.findOne({_id: userId})
    if (!foundUserId) {
      const newCommentId: ObjectId = new ObjectId();
      const newComment = {commentId: newCommentId, comment: comment};
      const newFeedback = {_id: userId, allFeedbacks: [newComment]};
      const result = await MyModelFeedbacks.create(newFeedback);
      return newFeedback

    } else {
      const newCommentId: ObjectId = new ObjectId()
      const newFeedback = {commentId: newCommentId, comment: comment}
      const result = await MyModelFeedbacks.updateOne({_id: userId}, {$push: {allFeedbacks: newFeedback}})
      return {_id: newCommentId, allFeedbacks: [newFeedback]}
    }
  }
  async getAllFeedbacks(): Promise<FeedbackDBType[]> {
    return MyModelFeedbacks.find({}).lean()
  }
}