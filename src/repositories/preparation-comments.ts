import {
  CommentType,
  UserType
} from "../types/tsTypes";
import {MyModelLikeStatusCommentId} from "../mongoose/likeStatusComment";
import {injectable} from "inversify";

@injectable()
export class PreparationComments {

  async preparationCommentsForReturn(commentsArray: CommentType[], currentUser: UserType | null) {
    const filledComments = []
    for (let i in commentsArray) {
      const commentId = commentsArray[i].id
      const currentComment: CommentType = commentsArray[i]

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

      // getting likes count
      const likesCount = await MyModelLikeStatusCommentId.countDocuments({
        $and:
          [{commentId: commentId},
            {likeStatus: "Like"}]
      })

      // getting dislikes count
      const dislikesCount = await MyModelLikeStatusCommentId.countDocuments({
        $and:
          [{commentId: commentId},
            {likeStatus: "Dislike"}]
      })

      const filledComment: CommentType  = {
        id: currentComment.id,
        content: currentComment.content,
        userId: currentComment.userId,
        userLogin: currentComment.userLogin,
        createdAt: currentComment.createdAt,
        likesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: ownLikeStatus
        }
      }
      filledComments.push(filledComment)
    }
    return filledComments
  }
}