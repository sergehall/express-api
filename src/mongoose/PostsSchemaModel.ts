import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface PostsType extends Document{
  id: string | null;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
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
  bloggerId: {
    type: String,
    required: [true, 'Id is required']
  },
  bloggerName: {
    type: String,
    required: [true, 'Id is required']
  }
})

export const MyModelPosts =  mongoose.model<PostsType>("posts", PostsSchema, 'Posts')
