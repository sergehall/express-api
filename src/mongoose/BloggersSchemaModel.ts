import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface BloggerType extends Document {
  id: string | null
  name: string;
  youtubeUrl: string;
}

const BloggerSchema = new Schema({
  id: {
    type: String,
    required: [true, 'id is required']
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
