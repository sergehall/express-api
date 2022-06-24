import {Request, Response} from "express";
import {ReturnTypeObjectComment} from "../types/all_types";
import {CommentsService} from "../domain/comments-service";


export class CommentsController {
  constructor(private commentsService: CommentsService) {
    this.commentsService = commentsService
  }
  async getCommentById(req: Request, res: Response) {
    try {
      const commId = req.params.commentId;
      const getComment: ReturnTypeObjectComment = await this.commentsService.findCommentById(commId);
      if (getComment.data !== null) {
        res.send(getComment.data)
      } else {
        res.status(404).send()
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async updateCommentsById(req: Request, res: Response) {
    try {
      const commentId: string = req.params.commentId;
      const content: string = req.body.content

      const updatedComment: ReturnTypeObjectComment = await this.commentsService.updateCommentById(commentId, content)

      if (updatedComment.resultCode === 0) {
        res.status(204)
        res.send()
        return
      }
      const errorsMessages = updatedComment.errorsMessages
      const resultCode = updatedComment.resultCode
      res.send({errorsMessages, resultCode})

    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  async deleteCommentsById(req: Request, res: Response) {
    const commentsId = req.params.commentId
    const deletedComments = await this.commentsService.deletedCommentById(commentsId)

    if (deletedComments.errorsMessages.length === 0) {
      res.sendStatus(204)
    }
    res.send()
    return
  }
}