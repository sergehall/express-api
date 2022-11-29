import mongoose from 'mongoose';
import {likeArr, likeStatusPostsIdType} from "../types/tsTypes";


const LikeStatusPostsIdSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: [true, 'postId is required'],
  },
  userId: {
    type: String,
    required: [true, 'userId is required'],
  },
  login: {
    type: String,
    required: [true, 'login is required']
  },
  likeStatus: {
    type: String,
    validate: (value: string) => likeArr.includes(value),
    required: [true, 'likeStatus is required']
  },
  addedAt: {
    type: String,
    required: [true, 'addedAt is required']
  }
})

export const MyModelLikeStatusPostsId = mongoose.model<likeStatusPostsIdType>("likeStatusPosts", LikeStatusPostsIdSchema, 'LikeStatusPosts')
