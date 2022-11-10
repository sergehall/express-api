import mongoose from 'mongoose';
import {AllDeletedPostsType} from "../types/types";


const AllDeletedPostsSchema = new mongoose.Schema({
  bloggerIdKey: {
    type: String,
    required: true
  },
  posts: {
    type: Array({
        id: String || null,
        title: String,
        shortDescription: String,
        content: String,
        bloggerId: String,
        bloggerName: String,
      }
    ),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelAllDeletedPosts = mongoose.model<AllDeletedPostsType>("allDeletedPosts", AllDeletedPostsSchema, 'AllDeletedPosts')
