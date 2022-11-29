import {Request, Response} from "express";
import {ReturnObjCommentType} from "../types/tsTypes";
import {CommentsService} from "../domain/comments-service";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/types";

@injectable()
export class CommentsController {
  constructor(@inject(TYPES.CommentsService) protected commentsService: CommentsService) {
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
        return res.sendStatus(204)
      }

      return res.send({
        errorsMessages: [
          {
            "message": updatedComment.errorsMessages[0].message,
            "field": updatedComment.errorsMessages[0].field
          }
        ]
      })

    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  async deleteCommentsById(req: Request, res: Response) {
    const commentsId = req.params.commentId
    const deletedComments = await this.commentsService.deletedCommentById(commentsId)

    if (deletedComments.errorsMessages.length === 0) {
      return res.sendStatus(204)
    }
    return res.send()
  }

  async likeStatusCommentId(req: Request, res: Response) {
    const likeStatus = req.body.likeStatus
    const commentId: string = req.params.commentId;
    const user = req.user
    if (!user) {
      return res.sendStatus(401)
    }

    const changeLikeStatus = await this.commentsService.changeLikeStatusComment(user, commentId, likeStatus);
    if (!changeLikeStatus) {
      return res.sendStatus(404)
    }
    return res.sendStatus(204)
  }
}