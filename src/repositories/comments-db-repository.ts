import {commentsCollection} from "./db";
import {
  ArrayErrorsType, ReturnTypeObjectComment,
} from "../types/all_types";
import {
  MongoHasNotUpdated, notDeletedComment,
  notFoundCommentId
} from "../middlewares/input-validator-middleware";



export class CommentsRepository {

  async findCommentById(commentId: string): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];
    const filter = {"allComments.id": commentId}

    const foundPostWithComments = await commentsCollection.findOne(filter, {
      projection: {
        _id: false
      }
    })

    const comment = foundPostWithComments?.allComments.filter(i => i.id === commentId)[0]

    if (!comment) {
      errorsArray.push(notFoundCommentId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: comment,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async updateCommentById(commentId: string, content: string): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];
    const filterToUpdate = {"allComments.id": commentId}
    console.log(filterToUpdate, 'filterToUpdate')
    let resultCode = 0

    const result = await commentsCollection.updateOne(filterToUpdate,{$set: {"allComments.$.content": content}})

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

}