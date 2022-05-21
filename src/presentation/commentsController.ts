import {Request, Response} from "express";
import {ReturnTypeObjectComment, UserDBType} from "../types/all_types";
import {CommentsService} from "../domain/comments-service";


export class CommentsController {
  constructor(private commentsService: CommentsService) {
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
      const  user: UserDBType = req.user

      if (user === null) {
        res.status(401)
        res.send()
        return
      }

      const updatedComment: ReturnTypeObjectComment = await this.commentsService.updateCommentById(commentId, content, user)

      if (updatedComment.resultCode === 0) {
        res.status(204)
        res.send()
        return
      }
      // if (updatedComment.errorsMessages.find(f => f.field === "forbidden")) {
      //   res.status(403)
      //   res.send()
      //   return
      // }
      if (updatedComment.errorsMessages.find(f => f.field === "commentId")) {
        res.status(404)
        res.send()
        return
      }
      if (updatedComment.errorsMessages.find(f => f.field === "content")) {
        res.status(400)
        const errorsMessages = updatedComment.errorsMessages
        const resultCode = updatedComment.resultCode
        res.send({errorsMessages, resultCode})
        return
      }
      res.status(403)
      res.send()
      return

      // res.status(204)
      // res.send()
      //
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  async deleteCommentsById(req: Request, res: Response) {
    const commentsId = req.params.commentId
    const  user: UserDBType = req.user

    if (user === null) {
      res.status(401)
      res.send()
      return
    }
    const deletedComments = await this.commentsService.deletedCommentById(commentsId, user)

    if (deletedComments.data !== null) {
      res.sendStatus(204)
    }
    if (deletedComments.errorsMessages.find(f => f.field === "forbidden")) {
      res.status(403)
      res.send()
      return
    }
    if (deletedComments.errorsMessages.find(f => f.field === "commentId")) {
      res.status(404)
      res.send()
      return
    }

  }

}