import {
  feedbacksCollection,
} from "./db";
import {ObjectId} from "mongodb";
import {FeedbackDBType} from "../types/all_types";


export class FeedbacksRepository{
  async createFeedback(userId: ObjectId, comment: string): Promise<FeedbackDBType> {

    const foundUserId = await feedbacksCollection.findOne({_id: userId})
    if (!foundUserId) {
      const newCommentId: ObjectId = new ObjectId();
      const newComment = {commentId: newCommentId, comment: comment};
      const newFeedback = {_id: userId, allFeedbacks: [newComment]};
      const result = await feedbacksCollection.insertOne(newFeedback);
      return newFeedback

    } else {
      const newCommentId: ObjectId = new ObjectId()
      const newFeedback = {commentId: newCommentId, comment: comment}
      const result = await feedbacksCollection.updateOne({_id: userId}, {$push: {allFeedbacks: newFeedback}})
      return {_id: ObjectId, allFeedbacks: [newFeedback]}
    }
  }
  async getAllFeedbacks(): Promise<FeedbackDBType[]> {
    return feedbacksCollection.find({}).toArray()
  }
}