import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface likeStatusPostsIdType extends Document {
  postId: string
  userId: string
  likeStatus: string
  createdAt: string
}

const LikeStatusPostsIdSchema = new Schema({
  postId: {
    type: String,
    required: [true, 'postId is required'],
  },
  userId: {
    type: String,
    required: [true, 'userId is required'],
  },
  likeStatus: {
    type: String,
    required: [true, 'likeStatus is required']
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required']
  }
})

export const MyModelLikeStatusPostsId =  mongoose.model<likeStatusPostsIdType>("likeStatusPosts", LikeStatusPostsIdSchema, 'LikeStatusPostsId')
