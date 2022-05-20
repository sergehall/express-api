import {commentsCollection} from "./db";
import {
  ArrayErrorsType, ReturnTypeObjectComment, UserDBType,
} from "../types/all_types";
import {
  forbiddenUpdateComment,
  MongoHasNotUpdated, notDeletedComment,
  notFoundCommentId
} from "../middlewares/input-validator-middleware";



export class CommentsRepository {

  async findCommentById(commentId: string): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];

    let filter = {}
    if (commentId) {
      filter = {"allComments.id": commentId}
    }
    const result = await commentsCollection.findOne(filter, {
      projection: {
        _id: false
      }
    })

    if (!result) {
      errorsArray.push(notFoundCommentId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: result?.allComments.filter(i => i.id === commentId)[0],
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async updateCommentById(commentId: string, content: string, user: UserDBType): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];
    const userLogin = user.login
    const userId = user.id
    const filterToUpdate = {"allComments.id": commentId}

    const foundPostWithComments = await commentsCollection.findOne(filterToUpdate)
    if (!foundPostWithComments) {
      errorsArray.push(notFoundCommentId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const postWithComments = foundPostWithComments.allComments.filter(i => i.id === commentId)[0]

    if (postWithComments.userId !== userId || postWithComments.userLogin !== userLogin) {
      errorsArray.push(forbiddenUpdateComment)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const result = await commentsCollection.updateOne(filterToUpdate,{$set: {"allComments.$.content": content}})

    if (result.modifiedCount === 0 && result.matchedCount == 0) {
      errorsArray.push(MongoHasNotUpdated)
    }

    if (errorsArray.length !== 0 || !postWithComments) {
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    return {
      data: postWithComments,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async deletedCommentById(commentId: string, user: UserDBType): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];
    const userLogin = user.login
    const userId = user.id
    const filterToDelete = {"allComments.id": commentId}

    const foundPostWithComments = await commentsCollection.findOne(filterToDelete)
    if (!foundPostWithComments) {
      errorsArray.push(notFoundCommentId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const deletedPostWithComments = foundPostWithComments.allComments.filter(i => i.id === commentId)[0]
    if (deletedPostWithComments.userId !== userId || deletedPostWithComments.userLogin !== userLogin) {
      errorsArray.push(forbiddenUpdateComment)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const resultDeleted = await commentsCollection.findOneAndUpdate(filterToDelete, {
      $pull: {
        allComments: {
          id: commentId
        }
      }
    })

    if (resultDeleted.ok === 0) {
      errorsArray.push(notDeletedComment)
      return {
        data: deletedPostWithComments,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: deletedPostWithComments,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

}