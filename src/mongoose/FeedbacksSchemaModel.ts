import mongoose from 'mongoose';
import {FeedbacksTypeModel} from "../types/types";


const FeedbacksSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'id is required'],
    unique: true
  },
  allFeedbacks: {
    type: Array({
      commentId: {
        type: String,
        required: [true, 'commentId from Feedback is required']
      },
      comment: {
        type: String,
        required: [true, 'comment from Feedback is required']
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelFeedbacks = mongoose.model<FeedbacksTypeModel>("feedbacks", FeedbacksSchema, 'Feedbacks')
