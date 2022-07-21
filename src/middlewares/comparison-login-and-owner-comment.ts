import {UserAccountDBType} from "../types/all_types";
import {Request, Response, NextFunction} from "express";
import {commentsCollection} from "../repositories/db";


export class ComparingLoginAndOwnersComment {
  async comparing(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserAccountDBType = req.user
      const userLogin = user.accountData.login
      const userId = user.accountData.id
      const commentId: string = req.params.commentId;
      const filterToUpdate = {"allComments.id": commentId}

      const foundPostWithComments = await commentsCollection.findOne(filterToUpdate)
      if (foundPostWithComments) {
        const postWithComments = foundPostWithComments.allComments.filter(i => i.id === commentId)[0]
        if (postWithComments.userId === userId && postWithComments.userLogin === userLogin) {
          next()
          return
        }
        res.sendStatus(403)
        return
      }
      res.sendStatus(404)
      return

    } catch (e) {
      console.log(e)
      res.sendStatus(401)
      return
    }
  }
}
