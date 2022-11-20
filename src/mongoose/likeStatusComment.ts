import mongoose from 'mongoose';
import {likeStatusCommentIdType} from "../types/types";


const LikeStatusCommentIdSchema = new mongoose.Schema({
  commentId: {
    type: String,
    required: [true, 'commentId is required'],
  },
  userId: {
    type: String,
    required: [true, 'userId is required'],
  },
  likeStatus: {
    type: String,
    required: [true, 'likeStatus is required']
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required']
  }
})

export const MyModelLikeStatusCommentId =  mongoose.model<likeStatusCommentIdType>("likeStatusComment", LikeStatusCommentIdSchema, 'LikeStatusComment')
