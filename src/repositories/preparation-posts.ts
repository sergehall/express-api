import {
  PostsType,
  UserType,
} from "../types/types";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";


export class PreparationPosts {

  async preparationPostsForReturn(postArray: PostsType[], currentUser: UserType | null): Promise<PostsType[]> {
    const filledPosts = []
    for (let i in postArray) {
      const postId = postArray[i].id
      const currentPost: PostsType = postArray[i]

      currentPost.extendedLikesInfo.likesCount = await MyModelLikeStatusPostsId.countDocuments({
        $and:
          [{postId: postId},
            {likeStatus: "Like"}]
      }).lean()

      // getting dislikes and count
      currentPost.extendedLikesInfo.dislikesCount = await MyModelLikeStatusPostsId.countDocuments({
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
      currentPost.extendedLikesInfo.myStatus = ownStatus

      // getting 3 last likes
      currentPost.extendedLikesInfo.newestLikes = await MyModelLikeStatusPostsId.find(
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
      filledPosts.push(currentPost)
    }
    return filledPosts
  }
}