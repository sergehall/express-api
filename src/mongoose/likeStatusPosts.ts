import mongoose from 'mongoose';
import {likeStatusPostsIdType} from "../types/all_types";


const LikeStatusPostsIdSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: [true, 'postId is required'],
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

export const MyModelLikeStatusPostsId =  mongoose.model<likeStatusPostsIdType>("likeStatusPosts", LikeStatusPostsIdSchema, 'LikeStatusPostsId')
