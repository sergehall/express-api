import {
  CommentsTypeModel,
  CommentType,
} from "../types/tsTypes";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import {inject, injectable} from "inversify";
import {PreparationComments} from "./preparation-comments";
import {TYPES} from "../types/types";

@injectable()
export class CommentsRepository {

  constructor(@inject(TYPES.PreparationComments) protected preparationComments: PreparationComments) {
  }

  async findCommentById(commentId: string): Promise<CommentType | null> {
    const result = await MyModelComments.findOne(
      {"allComments.id": commentId},
      {
        _id: false,
        "allComments._id": false
      }
    ).then(c => c?.allComments.filter(i => i.id === commentId)[0])
    return result ? result : null;
  }

  async createCommentByPostId(postId: string, newComment: CommentType): Promise<CommentsTypeModel | null> {
    return await MyModelComments.findOneAndUpdate(
      {postId: postId},
      {
        $push: {allComments: newComment}
      },
      {upsert: true}
    )
  }

  async findAllCommentsByPostId(postId: string): Promise<CommentsTypeModel | null> {
    return await MyModelComments.findOne(
      {postId: postId},
      {_id: false, 'allComments._id': false})
  }

  async updateCommentById(commentId: string, content: string): Promise<Boolean> {

    const result = await MyModelComments.updateOne(
      {"allComments.id": commentId},
      {$set: {"allComments.$.content": content}})

    return (result.modifiedCount !== 0 && result.matchedCount !== 0)
  }

  async deletedCommentById(commentId: string): Promise<Boolean> {

    const resultDeleted = await MyModelComments.findOneAndUpdate(
      {"allComments.id": commentId},
      {
        $pull: {
          allComments: {
            id: commentId
          }
        }
      },
      {returnDocument: "after"}).lean()
    if (!resultDeleted) {
      return false
    }
    // check comment is deleted
    return resultDeleted.allComments.filter(i => i.id === commentId).length === 0
  }

}