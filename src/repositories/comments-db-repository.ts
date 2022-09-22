import {
  ArrayErrorsType, ReturnTypeObjectComment,
} from "../types/all_types";
import {
  MongoHasNotUpdated, notDeletedComment,
  notFoundCommentId
} from "../middlewares/errorsMessages";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";



export class CommentsRepository {

  async findCommentById(commentId: string): Promise<ReturnTypeObjectComment> {
    const errorsArray: ArrayErrorsType = [];
    const filter = {"allComments.id": commentId}

    const foundPostWithComments = await MyModelComments.findOne(filter, {
        _id: false
    }).lean()

    const comment = foundPostWithComments?.allComments.filter(i => i.id === commentId)[0]

    if (!comment) {
      errorsArray.push(notFoundCommentId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    // @ts-ignore
    delete comment._id

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

    const result = await MyModelComments.updateOne(filterToUpdate,{$set: {"allComments.$.content": content}})

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

}