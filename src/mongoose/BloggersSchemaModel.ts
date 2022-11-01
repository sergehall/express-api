import mongoose from 'mongoose';
import {BloggerType} from "../types/all_types";


const BloggerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'id is required'],
    unique:true
  },
  name: {
    type: String,
    required: [true, 'name is required']
  },
  youtubeUrl: {
    type: String,
    required: [true, 'youtubeUrl is required']
  }
})

export const MyModelBloggers =  mongoose.model<BloggerType>("bloggers", BloggerSchema, 'Bloggers')
