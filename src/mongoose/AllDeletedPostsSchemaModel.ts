import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface AllDeletedPostsType extends Document{
  bloggerIdKey: string;
  posts: Array<{
    id: string | null;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: string;
    bloggerName: string;
  }>
}

const AllDeletedPostsSchema = new Schema({
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
