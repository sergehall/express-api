import {CommentsRepository} from "../repositories/comments-db-repository";
import {
  CommentType,
  FilterCommentId,
  ReturnTypeObjectComment, UserAccountType
} from "../types/types";


export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {
    this.commentsRepository = commentsRepository
  }
  async findCommentByCommentId(filter: FilterCommentId): Promise<CommentType | null> {
    return await this.commentsRepository.findCommentByCommentId(filter)
  }

  async findCommentById(commentId: string, currentUser: UserAccountType | null): Promise<ReturnTypeObjectComment>{
    return await this.commentsRepository.findCommentById(commentId, currentUser)
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