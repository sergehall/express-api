import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface ThreeLastLikesPostType extends Document {
  postId: string
  threeNewestLikes: {
    addedAt: string,
    userId: string,
    login: string
  }[]
}

const ThreeLastLikesPostSchema = new Schema({
  postId: {
    type: String,
    required: [true, 'Id is required'],
  },
  threeNewestLikes: {
    type: Array({
      addedAt: {
        type: String,
        required: [true, 'Id is required']
      },
      userId: {
        type: String,
        required: [true, 'Id is required']
      },
      login: {
        type: String,
        required: [true, 'Id is required']
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelThreeLastLikesPost = mongoose.model<ThreeLastLikesPostType>("threeLastLikesPost", ThreeLastLikesPostSchema, 'ThreeLastLikesPost')
