import mongoose, {Document} from 'mongoose';
import {ObjectId} from "mongodb";

const Schema = mongoose.Schema

interface FeedbacksType extends Document {
  _id: ObjectId;
  allFeedbacks: {
    commentId: ObjectId;
    comment: Array<{
      type: string;
    }>
  }
}

const FeedbacksSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Id is required']
  },
  allFeedbacks: {
    commentId: Schema.Types.ObjectId,
    comment: {
      type: Array({
        type: String,
        required: true
      }),
      validate: (v: any) => Array.isArray(v)
    }
  }
})

export const MyModelFeedbacks = mongoose.model<FeedbacksType>("feedbacks", FeedbacksSchema, 'Feedbacks')
