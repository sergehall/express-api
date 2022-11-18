import {
  ArrayPostsExtLikesInfo,
  PostsType, UserType,
} from "../types/types";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {MyModelThreeLastLikesPost} from "../mongoose/ThreeLastLikesPost";


export class PreparationPosts {
  async preparationPostsForReturn(myArray: ArrayPostsExtLikesInfo, currentUser: UserType | null) {
    for (let i in myArray) {
      const id = myArray[i].id
      const post: PostsType = myArray[i]
      post.extendedLikesInfo.likesCount = await MyModelLikeStatusPostsId.countDocuments({
        $and:
          [{postId: id},
            {likeStatus: "Like"}]
      }).lean()

      // getting dislikes and count
      post.extendedLikesInfo.dislikesCount = await MyModelLikeStatusPostsId.countDocuments({
        $and:
          [{postId: id},
            {likeStatus: "Dislike"}]
      }).lean()

      // getting the status of the post owner
      post.extendedLikesInfo.myStatus = "None"
      if (currentUser) {
        const statusPostOwner = await MyModelLikeStatusPostsId.findOne({
          $and:
            [{postId: id},
              {userId: currentUser.accountData.id}]
        }).lean()
        if (statusPostOwner) {
          post.extendedLikesInfo.myStatus = statusPostOwner.likeStatus
        }
      }

      // getting 3 last likes
      const lastThreeLikesArray = await MyModelThreeLastLikesPost.findOne({postId: id}, {
        _id: false,
        __v: false
      }).lean()
      if (lastThreeLikesArray && post) {
        const withoutObjId = []
        for (let i of lastThreeLikesArray.threeNewestLikes) {
          withoutObjId.push({
            addedAt: i.addedAt,
            userId: i.userId,
            login: i.login
          })
        }

        // NewestLikes sorted in descending
        post.extendedLikesInfo.newestLikes = withoutObjId.sort(function (a: any, b: any) {
          if (a.addedAt < b.addedAt) {
            return 1;
          }
          if (a.addedAt > b.addedAt) {
            return -1;
          }
          return 0;
        })
      }
    }
  }
}