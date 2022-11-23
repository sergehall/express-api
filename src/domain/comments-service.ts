import {CommentsRepository} from "../repositories/comments-db-repository";
import {
  CommentType, ReturnObjCommentType,
  UserType
} from "../types/types";


export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {
  }

  async findCommentCompareOwner(commentId: string): Promise<CommentType | null> {
    return await this.commentsRepository.findCommentCompareOwner(commentId)
  }

  async findCommentByCommentId(commentId: string, currentUser: UserType | null): Promise<ReturnObjCommentType> {
    return await this.commentsRepository.findCommentByCommentId(commentId, currentUser)
  }

  async updateCommentById(commentId: string, content: string): Promise<ReturnObjCommentType> {
    return await this.commentsRepository.updateCommentById(commentId, content)
  }

  async deletedCommentById(commentId: string): Promise<ReturnObjCommentType> {
    return await this.commentsRepository.deletedCommentById(commentId)
  }

  async changeLikeStatusComment(user: UserType, commentId: string, likeStatus: string) {
    return await this.commentsRepository.changeLikeStatusComment(user, commentId, likeStatus)
  }

}