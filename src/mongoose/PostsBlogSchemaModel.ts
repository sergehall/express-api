import mongoose from 'mongoose';
import {BlogPostsType} from "../types/types";


const BlogPostsSchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: [true, 'blogId is required']
  },
  allPosts: {
    type: Array({
      id: {
        type: String,
        required: [true, 'id is required']
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
        required: [true, 'createdAt is required']
      }
    })
  }
})

export const MyModelBlogPosts = mongoose.model<BlogPostsType>("blogPosts", BlogPostsSchema, 'BlogPosts')
