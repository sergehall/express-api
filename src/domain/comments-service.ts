import {CommentsRepository} from "../repositories/comments-db-repository";
import {
  ReturnTypeObjectComment,
} from "../types/all_types";


export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {
    this.commentsRepository = commentsRepository
  }

  async findCommentById(commentId: string): Promise<ReturnTypeObjectComment>{
    return await this.commentsRepository.findCommentById(commentId)
  }

  async updateCommentById(commentId: string, content: string): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.updateCommentById(commentId, content)
  }

  async deletedCommentById(commentId: string): Promise<ReturnTypeObjectComment> {
    return await this.commentsRepository.deletedCommentById(commentId)
  }

}