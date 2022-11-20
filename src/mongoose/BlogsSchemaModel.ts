import mongoose from 'mongoose';
import {BlogsType} from "../types/types";



const BlogsSchema = new  mongoose.Schema({
  id: {
    type: String,
    required: [true, 'id is required']
  },
  name: {
    type: String,
    required: [true, 'name is required']
  },
  websiteUrl: {
    type: String,
    required: [true, 'youtubeUrl is required']
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required']
  }
})

export const MyModelBlogs =  mongoose.model<BlogsType>("blogs", BlogsSchema, 'Blogs')
