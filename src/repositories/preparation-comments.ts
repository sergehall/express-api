import {
  CommentType,
  UserType
} from "../types/types";
import {MyModelLikeStatusCommentId} from "../mongoose/likeStatusComment";


export class PreparationComments {

  async preparationCommentsForReturn(commentsArray: CommentType[], currentUser: UserType | null) {
    const filledComments = []
    for (let i in commentsArray) {
      const commentId = commentsArray[i].id
      const comment: CommentType = commentsArray[i]
      let ownLikeStatus = "None"

      if(currentUser){
        const currentComment = await MyModelLikeStatusCommentId.findOne(
          {
            $and: [
              {userId: currentUser.accountData.id},
              {commentId: commentId}]
          },
          {
            _id: false,
            __v: false,}
        )
        if (currentComment) {
          ownLikeStatus = currentComment.likeStatus
        }
      }
      comment.likesInfo.myStatus = ownLikeStatus

      comment.likesInfo.likesCount = await MyModelLikeStatusCommentId.countDocuments({
        $and:
          [{commentId: commentId},
            {likeStatus: "Like"}]
      })

      comment.likesInfo.dislikesCount = await MyModelLikeStatusCommentId.countDocuments({
        $and:
          [{commentId: commentId},
            {likeStatus: "Dislike"}]
      })

      filledComments.push(comment)
    }
    return filledComments
  }
}