import {CommentsRepository} from "../repositories/comments-db-repository";
import {
  ReturnTypeObjectComment,
  UserAccountDBType,
} from "../types/all_types";


export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {
    this.commentsRepository = commentsRepository
  }
  async findCommentInDB(filter: { "allComments.id": string }) {
    return await this.commentsRepository.findCommentInDB(filter)
  }

  async getCommentById(commentId: string, currentUser: UserAccountDBType | null): Promise<ReturnTypeObjectComment>{
    return await this.commentsRepository.getCommentById(commentId, currentUser)
  }

  async updateCommentById(commentId: string, content: string): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.updateCommentById(commentId, content)
  }

  async deletedCommentById(commentId: string): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.deletedCommentById(commentId)
  }

  async changeLikeStatusComment(user: UserAccountDBType, commentId: string, likeStatus: string) {
    return await this.commentsRepository.changeLikeStatusComment(user, commentId, likeStatus)
  }

}