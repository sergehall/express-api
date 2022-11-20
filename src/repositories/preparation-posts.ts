import {
  PostsType,
  UserType,
} from "../types/types";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";


export class PreparationPosts {

  async preparationPostsForReturn(myArray: PostsType[], currentUser: UserType | null) {
    for (let i in myArray) {
      const postId = myArray[i].id
      const post: PostsType = myArray[i]
      post.extendedLikesInfo.likesCount = await MyModelLikeStatusPostsId.countDocuments({
        $and:
          [{postId: postId},
            {likeStatus: "Like"}]
      }).lean()

      // getting dislikes and count
      post.extendedLikesInfo.dislikesCount = await MyModelLikeStatusPostsId.countDocuments({
        $and:
          [{postId: postId},
            {likeStatus: "Dislike"}]
      }).lean()

      // getting the status of the post owner
      let ownStatus = "None"
      if (currentUser) {
        const findOwnPost = await MyModelLikeStatusPostsId.findOne(
          {
            $and:
              [
                {postId: postId},
                {userId: currentUser.accountData.id}
              ]
          }
        )
        if (findOwnPost) {
          ownStatus = findOwnPost.likeStatus
        }
      }
      post.extendedLikesInfo.myStatus = ownStatus

      // getting 3 last likes
      post.extendedLikesInfo.newestLikes = await MyModelLikeStatusPostsId.find(
        {
          $and:
            [
              {postId: postId},
              {likeStatus: "Like"}
            ]
        },
        {
          _id: false,
          __v: false,
          postId: false,
          likeStatus: false
        })
        .sort({addedAt: -1})
        .limit(3)
    }
  }
}