import mongoose from 'mongoose';
import {CommentsType} from "../types/all_types";


const CommentsSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: [true, 'postId is required']
  },
  allComments: {
    type: Array({
      id: {
        type: String,
        required: [true, 'id is required']
      },
      content: {
        type: String,
        required: [true, 'content is required']
      },
      userId: {
        type: String,
        required: [true, 'userId is required']
      },
      userLogin: {
        type: String,
        required: [true, 'userLogin is required']
      },
      addedAt: {
        type: String,
        required: [true, 'addedAt is required']
      },
      likesInfo: {
        likesCount: {
          type: Number,
          required: [true, 'likesInfo is required']
        },
        dislikesCount: {
          type: Number,
          required: [true, 'dislikesCount is required']
        },
        myStatus: {
          type: String,
          required: [true, 'myStatus is required']
        }
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelComments = mongoose.model<CommentsType>("comments", CommentsSchema, 'Comments')
