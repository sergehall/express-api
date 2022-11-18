import {CommentsRepository} from "../repositories/comments-db-repository";
import {
  CommentType,
  ReturnTypeObjectComment, UserAccountType
} from "../types/types";


export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {
  }

  async findCommentCompareOwner(commentId: string): Promise<CommentType | null> {
    return await this.commentsRepository.findCommentCompareOwner(commentId)
  }

  async findCommentByCommentId(commentId: string, currentUser: UserAccountType | null): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.findCommentByCommentId(commentId, currentUser)
  }

  async updateCommentById(commentId: string, content: string): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.updateCommentById(commentId, content)
  }

  async deletedCommentById(commentId: string): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.deletedCommentById(commentId)
  }

  async changeLikeStatusComment(user: UserAccountType, commentId: string, likeStatus: string) {
    return await this.commentsRepository.changeLikeStatusComment(user, commentId, likeStatus)
  }

}