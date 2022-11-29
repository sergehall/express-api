import {injectable} from "inversify";
import {DTOLikeStatusComm} from "../types/tsTypes";
import {MyModelLikeStatusCommentId} from "../mongoose/likeStatusComment";


@injectable()
export class LikeStatusCommentsRepository {
  async updateLikeStatusComment(dtoLikeStatusComm: DTOLikeStatusComm){
    const result = await MyModelLikeStatusCommentId.findOneAndUpdate(
      {
        $and:
          [
            {commentId: dtoLikeStatusComm.commentId},
            {userId: dtoLikeStatusComm.userId}
          ]
      },
      {
        $set: {
          commentId: dtoLikeStatusComm.commentId,
          userId: dtoLikeStatusComm.userId,
          likeStatus: dtoLikeStatusComm.likeStatus,
          createdAt: dtoLikeStatusComm.createdAt,
        }
      },
      {upsert: true}).lean()

    return result !== null
  }

}