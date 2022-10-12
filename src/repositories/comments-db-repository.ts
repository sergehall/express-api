import {
  ArrayErrorsType, ReturnTypeObjectComment, UserAccountDBType,
} from "../types/all_types";
import {
  MongoHasNotUpdated, notDeletedComment,
  notFoundCommentId
} from "../middlewares/errorsMessages";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import {MyModelLikeStatusCommentId} from "../mongoose/likeStatusComment";


export class CommentsRepository {

  async findCommentById(commentId: string, user: UserAccountDBType | null): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];
    const filter = {"allComments.id": commentId}
    const filterCommentId = {commentId: commentId}
    let filterUserId = {userId: ""}
    let currentLikeStatus = {likeStatus: "None"}

    if (user) {
      filterUserId = {userId: user.accountData.id}
    }


    const foundPostWithComments = await MyModelComments.findOne(filter, {
      _id: false
    }).lean()

    const checkCurrentLikeStatus = await MyModelLikeStatusCommentId.findOne(
      {
        $and:
          [filterCommentId, filterUserId]
      }).lean()


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

    if (!foundPostWithComments) {
      errorsArray.push(notFoundCommentId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    const comment = foundPostWithComments.allComments.filter(i => i.id === commentId)[0]

    const commentWithoutObjId = {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      addedAt: comment.addedAt,
      likesInfo: {
        likesCount: countLikes,
        dislikesCount: countDislike,
        myStatus: currentLikeStatus.likeStatus,
      }
    }

    if (!comment) {
      errorsArray.push(notFoundCommentId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    return {
      data: commentWithoutObjId,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async updateCommentById(commentId: string, content: string): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];
    const filterToUpdate = {"allComments.id": commentId}
    let resultCode = 0

    const result = await MyModelComments.updateOne(filterToUpdate, {$set: {"allComments.$.content": content}})

    if (result.modifiedCount === 0 && result.matchedCount == 0) {
      errorsArray.push(MongoHasNotUpdated)
    }

    if (errorsArray.length !== 0) {
      resultCode = 1
    }

    return {
      data: null,
      errorsMessages: errorsArray,
      resultCode: resultCode
    }
  }

  async deletedCommentById(commentId: string): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];
    const filterToDelete = {"allComments.id": commentId}

    const resultDeleted = await MyModelComments.findOneAndUpdate(filterToDelete, {
      $pull: {
        allComments: {
          id: commentId
        }
      }
    })

    if (!resultDeleted) {
      errorsArray.push(notDeletedComment)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: null,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async changeLikeStatusComment(user: UserAccountDBType, commentId: string, likeStatus: string): Promise<Boolean> {
    const userId = user.accountData.id
    const createdAt = (new Date()).toISOString()

    const newLikeStatus = {
      commentId: commentId,
      userId: userId,
      likeStatus: likeStatus,
      createdAt: createdAt,
    }
    try {
      const filter = {"allComments.id": commentId}
      const findCommentInDB = await MyModelComments.findOne(filter)
      if (!findCommentInDB) {
        return false
      }
      const currentLikeStatus = await MyModelLikeStatusCommentId.findOne(
        {
          $and:
            [{commentId: commentId},
              {userId: userId}]
        }).lean()
      if (!currentLikeStatus) {
        const createNewLikeStatusCommentId = await MyModelLikeStatusCommentId.create(newLikeStatus)
        return true
      }
      const updateLikeStatusCommentId = await MyModelLikeStatusCommentId.findOneAndUpdate(
        {
          $and:
            [{commentId: commentId},
              {userId: userId}]
        },
        {$set: {likeStatus: likeStatus}}).lean()

      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

}