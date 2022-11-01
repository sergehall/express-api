import mongoose  from 'mongoose';
import {PostsType} from "../types/all_types";


const PostsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Id is required!!!'],
  },
  title: {
    type: String,
    required: [true, 'title is required']
  },
  shortDescription: {
    type: String,
    required: [true, 'shortDescription is required']
  },
  content: {
    type: String,
    required: [true, 'content is required']
  },
  blogId: {
    type: String,
    required: [true, 'blogId is required']
  },
  blogName: {
    type: String,
    required: [true, 'blogName is required']
  },
  addedAt: {
    type: String,
    required: [true, 'addedAt is required']
  },
  extendedLikesInfo: {
    likesCount: {
      type: String,
      required: [true, 'likesCount is required']
    },
    dislikesCount: {
      type: String,
      required: [true, 'dislikesCount is required']
    },
    myStatus: {
      type: String,
      required: [true, 'myStatus is required']
    },
    newestLikes: {
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
  }
})

export const MyModelPosts = mongoose.model<PostsType>("posts", PostsSchema, 'Posts')
