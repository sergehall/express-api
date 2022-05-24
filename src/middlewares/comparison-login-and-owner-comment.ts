import {UserDBType} from "../types/all_types";
import {Request, Response, NextFunction} from "express";
import {commentsCollection} from "../repositories/db";


export const comparingLoginAndOwnersComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserDBType = req.user
    const userLogin = user.login
    const userId = user.id
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
  }
}