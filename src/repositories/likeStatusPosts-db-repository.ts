import {injectable} from "inversify";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {UserType} from "../types/tsTypes";


@injectable()
export class LikeStatusPostsRepository {

  async updateLikeStatusPost(user: UserType, postId: string, likeStatus: string, addedAt: string): Promise<Boolean> {

    const result = await MyModelLikeStatusPostsId.findOneAndUpdate(
      {
        $and:
          [
            {postId: postId},
            {userId: user.accountData.id}
          ]
      },
      {
        postId: postId,
        userId: user.accountData.id,
        login: user.accountData.login,
        likeStatus: likeStatus,
        addedAt: addedAt,
      },
      {upsert: true, returnDocument: "after"}
    ).lean()

    return result !== null
  }
}