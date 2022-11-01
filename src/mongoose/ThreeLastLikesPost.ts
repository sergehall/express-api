import mongoose from 'mongoose';
import {ThreeLastLikesPostType} from "../types/all_types";


const ThreeLastLikesPostSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: [true, 'postId is required'],
  },
  threeNewestLikes: {
    type: Array({
      addedAt: {
        type: String,
        required: [true, 'addedAt is required']
      },
      userId: {
        type: String,
        required: [true, 'userId is required']
      },
      login: {
        type: String,
        required: [true, 'login is required']
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelThreeLastLikesPost = mongoose.model<ThreeLastLikesPostType>("threeLastLikesPost", ThreeLastLikesPostSchema, 'ThreeLastLikesPost')
