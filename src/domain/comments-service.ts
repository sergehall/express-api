import {CommentsRepository} from "../repositories/comments-db-repository";
import {
  ReturnTypeObjectComment, UserDBType,
} from "../types/all_types";


export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {
    this.commentsRepository = commentsRepository
  }

  async findCommentById(commentId: string): Promise<ReturnTypeObjectComment>{
    return await this.commentsRepository.findCommentById(commentId)
  }

  async updateCommentById(commentId: string, content: string, user: UserDBType): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.updateCommentById(commentId, content, user)
  }

  async deletedCommentById(commentId: string, user: UserDBType): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.deletedCommentById(commentId, user)
  }

}