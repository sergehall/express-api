import {
  ArrayCommentsExtLikesInfo,
  UserAccountDBType
} from "../types/all_types";
import {MyModelLikeStatusCommentId} from "../mongoose/likeStatusComment";


export class PreparationComments {

  async preparationCommentsForReturn(commentsArray: ArrayCommentsExtLikesInfo, currentUser: UserAccountDBType | null) {
    const filledCommentsArray = []
    for (let i in commentsArray) {
      let currentLikeStatus = {likeStatus: "None"}
      let filterCurrentUserId = {userId: ""}
      if (currentUser) {
        filterCurrentUserId = {userId: currentUser.accountData.id}
      }
      const comment = commentsArray[i]
      const commentId = commentsArray[i].id
      const filterCommentId = {commentId: commentId}
      console.log(comment, 'comment')
      const checkCurrentLikeStatus = await MyModelLikeStatusCommentId.findOne(
        {
          $and: [filterCurrentUserId, filterCommentId]
        }
      )
      console.log(checkCurrentLikeStatus, "checkCurrentLikeStatus")
      if (checkCurrentLikeStatus) {
        currentLikeStatus = {likeStatus: checkCurrentLikeStatus.likeStatus}
      }

      const countLikes = await MyModelLikeStatusCommentId.countDocuments({
        $and:
          [{commentId: commentId},
            {likeStatus: "Like"}]
      }).lean()

      const countDislike = await MyModelLikeStatusCommentId.countDocuments({
        $and:
          [{commentId: commentId},
            {likeStatus: "Dislike"}]
      }).lean()

      console.log("-------------------------------", {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: countLikes,
          dislikesCount: countDislike,
          myStatus: currentLikeStatus.likeStatus,
        }
      }, "-------------------------------")
      filledCommentsArray.push({
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: countLikes,
          dislikesCount: countDislike,
          myStatus: currentLikeStatus.likeStatus,
        }
      })
    }
    return filledCommentsArray
  }
}