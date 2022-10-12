import {
  ArrayPostsExtLikesInfo,
  PostsType,
  UserAccountDBType
} from "../types/all_types";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {MyModelThreeLastLikesPost} from "../mongoose/ThreeLastLikesPost";


export class PreparationPosts {
  async preparationPostsForReturn(myArray: ArrayPostsExtLikesInfo, user: UserAccountDBType | null) {
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
      if (!user) {
        post.extendedLikesInfo.myStatus = "None"
      } else {
        const statusPostOwner = await MyModelLikeStatusPostsId.findOne({
          $and:
            [{postId: id},
              {userId: user.accountData.id}]
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