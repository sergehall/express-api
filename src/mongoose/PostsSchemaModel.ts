import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface PostsType extends Document {
  id: string
  title: string
  shortDescription: string
  content: string
  bloggerId: string
  bloggerName: string
  addedAt: string
  extendedLikesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes:
      {
        addedAt: string,
        userId: string,
        login: string
      }[]
  }
}

const PostsSchema = new Schema({
  id: {
    type: String,
    required: [true, 'Id is required!!!'],
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
  bloggerId: {
    type: String,
    required: [true, 'bloggerId is required']
  },
  bloggerName: {
    type: String,
    required: [true, 'bloggerName is required']
  },
  addedAt: {
    type: String,
    required: [true, 'addedAt is required']
  },
  extendedLikesInfo: {
    likesCount: {
      type: String,
      required: [true, 'likesCount is required']
    },
    dislikesCount: {
      type: String,
      required: [true, 'dislikesCount is required']
    },
    myStatus: {
      type: String,
      required: [true, 'myStatus is required']
    },
    newestLikes: {
      type: Array({
        addedAt: {
          type: String,
          required: [true, 'addedAt is required']
        },
        userId: {
          type: String,
          required: [true, 'userId is required']
        },
        login: {
          type: String,
          required: [true, 'login is required']
        }
      }),
      validate: (v: any) => Array.isArray(v)
    }
  }
})

export const MyModelPosts = mongoose.model<PostsType>("posts", PostsSchema, 'Posts')
