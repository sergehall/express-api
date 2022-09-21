import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface PostsType extends Document{
  id: string | null
  title: string
  shortDescription: string
  content: string
  blogId: string
  bloggerName: string
  createdAt: string
}

const PostsSchema = new Schema({
  id: {
    type: String,
    required: [true, 'Id is required']
  },
  title: {
    type: String,
    required: [true, 'Id is required']
  },
  shortDescription: {
    type: String,
    required: [true, 'Id is required']
  },
  content: {
    type: String,
    required: [true, 'Id is required']
  },
  blogId: {
    type: String,
    required: [true, 'Id is required']
  },
  bloggerName: {
    type: String,
    required: [true, 'Id is required']
  },
  createdAt: {
    type: String,
    required: [true, 'Id is required']
  }
})

export const MyModelPosts =  mongoose.model<PostsType>("posts", PostsSchema, 'Posts')
