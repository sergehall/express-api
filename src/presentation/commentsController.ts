import {Request, Response} from "express";
import {ReturnObjCommentType} from "../types/types";
import {CommentsService} from "../domain/comments-service";


export class CommentsController {
  constructor(protected commentsService: CommentsService) {
  }

  async findCommentByCommentId(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const currentUser = req.user
      const getComment: ReturnObjCommentType = await this.commentsService.findCommentByCommentId(commentId, currentUser);
      if (getComment.data !== null) {
        return res.send(getComment.data)
      } else {
        return res.status(404).send()
      }
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  async updateCommentsById(req: Request, res: Response) {
    try {
      const commentId: string = req.params.commentId;
      const content: string = req.body.content

      const updatedComment: ReturnObjCommentType = await this.commentsService.updateCommentById(commentId, content)

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

  async likeStatusCommentId(req: Request, res: Response) {
    const likeStatus = req.body.likeStatus
    const commentId: string = req.params.commentId;
    const user = req.user
    if(!user){
      return res.sendStatus(401)
    }

    const likeStatusComment = await this.commentsService.changeLikeStatusComment(user, commentId, likeStatus);
    if (!likeStatusComment) {
      return res.sendStatus(404)
    }
    return res.sendStatus(204)
  }

  async deleteCommentsById(req: Request, res: Response) {
    const commentsId = req.params.commentId
    const deletedComments = await this.commentsService.deletedCommentById(commentsId)

    if (deletedComments.errorsMessages.length === 0) {
      res.sendStatus(204)
      return
    }
    res.send()
    return
  }
}