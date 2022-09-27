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

export const MyModelLikeStatusPostsId =  mongoose.model<likeStatusPostsIdType>("likeStatusPosts", LikeStatusPostsIdSchema, 'LikeStatusPostsId')


// interface likeStatusPostsIdType extends Document{
//   postId: string
//   likesStatusArray: Array<{
//     userId: string
//     likeStatus: string
//     createdAt: string
//   }>
// }
//
// const LikeStatusPostsIdSchema = new Schema({
//   postId: {
//     type: String,
//     required: [true, 'Id is required'],
//   },
//   likesStatusArray: {
//     type: Array ({
//       userId: {
//         type: String,
//         required: [true, 'Id is required'],
//       },
//       likeStatus: {
//         type: String,
//         required: [true, 'Id is required']
//       },
//       createdAt: {
//         type: String,
//         required: [true, 'Id is required']
//       }
//     }),
//     validate: (v: any) => Array.isArray(v)
//   }
// })
//
// export const MyModelLikeStatusPostsId =  mongoose.model<likeStatusPostsIdType>("likeStatusPosts", LikeStatusPostsIdSchema, 'LikeStatusPostsId')
