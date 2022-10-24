import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface CommentsType extends Document {
  postId: string
  allComments: {
    id: string
    content: string
    userId: string
    userLogin: string
    addedAt: string
    likesInfo: {
      likesCount: number
      dislikesCount: number
      myStatus: string
    }
  }[]
}

const CommentsSchema = new Schema({
  postId: {
    type: String,
    required: [true, 'Id is required']
  },
  allComments: {
    type: Array({
      id: {
        type: String,
        required: [true, 'Id is required']
      },
      content: {
        type: String,
        required: [true, 'Id is required']
      },
      userId: {
        type: String,
        required: [true, 'Id is required']
      },
      userLogin: {
        type: String,
        required: [true, 'Id is required']
      },
      addedAt: {
        type: String,
        required: [true, 'Id is required']
      },
      likesInfo: {
        likesCount: {
          type: Number,
          required: [true, 'Id is required']
        },
        dislikesCount: {
          type: Number,
          required: [true, 'Id is required']
        },
        myStatus: {
          type: String,
          required: [true, 'Id is required']
        }
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelComments = mongoose.model<CommentsType>("comments", CommentsSchema, 'Comments')
