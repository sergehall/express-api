import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface BlogsType extends Document{
  id: string;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
}


const BlogsSchema = new Schema({
  id: {
    type: String,
    required: [true, 'Id is required']
  },
  name: {
    type: String,
    required: [true, 'Id is required']
  },
  youtubeUrl: {
    type: String,
    required: [true, 'Id is required']
  },
  createdAt: {
    type: Date,
    required: [true, 'Id is required']
  }
})

export const MyModelBlogs =  mongoose.model<BlogsType>("blogs", BlogsSchema, 'Blogs')
