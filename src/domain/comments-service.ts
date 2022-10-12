import {CommentsRepository} from "../repositories/comments-db-repository";
import {
  ReturnTypeObjectComment, UserAccountDBType,
} from "../types/all_types";


export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {
    this.commentsRepository = commentsRepository
  }

  async findCommentById(commentId: string, user: UserAccountDBType | null): Promise<ReturnTypeObjectComment>{
    return await this.commentsRepository.findCommentById(commentId, user)
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