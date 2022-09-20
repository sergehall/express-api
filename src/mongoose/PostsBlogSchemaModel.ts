import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface BlogPostsType extends Document {
  blogId: string;
  allPosts: Array<{
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
  }>
}

const BlogPostsSchema = new Schema({
  blogId: {
    type: String,
    required: [true, 'Id is required']
  },
  allPosts: {
    type: Array({
      id: {
        type: String,
        required: [true, 'Id is required']
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
      createdAt: {
        type: String,
        required: [true, 'createdAt is required']
      }
    })
  }
})

export const MyModelBlogPosts = mongoose.model<BlogPostsType>("blogPosts", BlogPostsSchema, 'BlogPosts')
