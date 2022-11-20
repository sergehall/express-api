import {
  ArrayPostsExtLikesInfo, OwnLikeStatus,
  PostsType, ThreeNewestLikesArray, UserType,
} from "../types/types";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";


export class PreparationPosts {

  async preparationPostsForReturn(myArray: ArrayPostsExtLikesInfo, currentUser: UserType | null) {
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
      post.extendedLikesInfo.myStatus = await this._ownLikeStatus(currentUser, postId).then(i => i.likeStatus)
      // post.extendedLikesInfo.myStatus = "None"
      // if (currentUser) {
      //   const statusPostOwner = await MyModelLikeStatusPostsId.findOne({
      //     $and:
      //       [{postId: postId},
      //         {userId: currentUser.accountData.id}]
      //   }).lean()
      //   if (statusPostOwner) {
      //     post.extendedLikesInfo.myStatus = statusPostOwner.likeStatus
      //   }
      // }

      // getting 3 last likes
      post.extendedLikesInfo.newestLikes = await this._threeLastLikesArray(currentUser, postId)
      // const lastThreeLikesArray = await MyModelThreeLastLikesPost.findOne({postId: id}, {
      //   _id: false,
      //   __v: false
      // }).lean()
      // if (lastThreeLikesArray && post) {
      //   const withoutObjId = []
      //   for (let i of lastThreeLikesArray.threeNewestLikes) {
      //     withoutObjId.push({
      //       addedAt: i.addedAt,
      //       userId: i.userId,
      //       login: i.login
      //     })
      //   }
      //
      //   // NewestLikes sorted in descending
      //   post.extendedLikesInfo.newestLikes = withoutObjId.sort(function (a: any, b: any) {
      //     if (a.addedAt < b.addedAt) {
      //       return 1;
      //     }
      //     if (a.addedAt > b.addedAt) {
      //       return -1;
      //     }
      //     return 0;
      //   })
      // }
    }
  }

  async _threeLastLikesArray(user: UserType | null, postId: string): Promise<ThreeNewestLikesArray> {

    const findThreeLastLikes = await MyModelLikeStatusPostsId.find(
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
        likeStatus: false})
      .sort({addedAt: -1})
      .limit(3)

    return findThreeLastLikes
  }

  async _ownLikeStatus(user: UserType | null, postId: string): Promise<OwnLikeStatus> {
    let ownStatus = "None"
    if (!user){
      return {likeStatus: ownStatus}
    }
    const findThreeLastLikes = await MyModelLikeStatusPostsId.findOne(
      {
        $and:
          [
            {postId: postId},
            {userId: user.accountData.id}
          ]
      },
      {_id: false, __v: false}
    )
    if(findThreeLastLikes){
      ownStatus = findThreeLastLikes.likeStatus
    }
    console.log(ownStatus, "ownStatus")
    return {likeStatus: ownStatus}
  }
}