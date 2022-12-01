import {injectable} from "inversify";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {DTOLikeStatusPost} from "../types/tsTypes";


@injectable()
export class LikeStatusPostsRepository {

  async updateLikeStatusPost(dtoLikeStatusPost: DTOLikeStatusPost): Promise<Boolean> {

    const result = await MyModelLikeStatusPostsId.findOneAndUpdate(
      {
        $and:
          [
            {postId: dtoLikeStatusPost.postId},
            {userId: dtoLikeStatusPost.userId}
          ]
      },
      {
        postId: dtoLikeStatusPost.postId,
        userId: dtoLikeStatusPost.userId,
        login: dtoLikeStatusPost.login,
        likeStatus: dtoLikeStatusPost.likeStatus,
        addedAt: dtoLikeStatusPost.addedAt,
      },
      {upsert: true, returnDocument: "after"}
    ).lean()

    return result !== null
  }
}