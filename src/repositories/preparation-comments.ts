import {
  ArrayCommentsExtLikesInfo,
  UserAccountDBType
} from "../types/all_types";
import {MyModelLikeStatusCommentId} from "../mongoose/likeStatusComment";


export class PreparationComments {

  async preparationCommentsForReturn(commentsArray: ArrayCommentsExtLikesInfo, currentUser: UserAccountDBType | null) {
    const filledCommentsArray = []
    for (let i in commentsArray) {
      const comment = commentsArray[i]
      const commentId = commentsArray[i].id
      const filterCommentId = {commentId: commentId}
      let currentLikeStatus = {likeStatus: "None"}

      if(currentUser && comment.userId === currentUser.accountData.id){
        const checkCurrentLikeStatus = await MyModelLikeStatusCommentId.findOne(
          {
            $and: [
              {userId: currentUser.accountData.id},
              filterCommentId]
          }
        )
        if (checkCurrentLikeStatus) {
          currentLikeStatus = {likeStatus: checkCurrentLikeStatus.likeStatus}
        }
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