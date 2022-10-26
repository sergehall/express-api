import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface likeStatusCommentIdType extends Document {
  commentId: string
  userId: string
  likeStatus: string
  createdAt: string
}

const LikeStatusCommentIdSchema = new Schema({
  commentId: {
    type: String,
    required: [true, 'commentId is required'],
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

export const MyModelLikeStatusCommentId =  mongoose.model<likeStatusCommentIdType>("likeStatusComment", LikeStatusCommentIdSchema, 'LikeStatusCommentId')
