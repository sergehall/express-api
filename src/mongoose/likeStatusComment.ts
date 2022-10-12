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
    required: [true, 'Id is required'],
  },
  userId: {
    type: String,
    required: [true, 'Id is required'],
  },
  likeStatus: {
    type: String,
    required: [true, 'Id is required']
  },
  createdAt: {
    type: String,
    required: [true, 'Id is required']
  }
})

export const MyModelLikeStatusCommentId =  mongoose.model<likeStatusCommentIdType>("likeStatusComment", LikeStatusCommentIdSchema, 'LikeStatusCommentId')
