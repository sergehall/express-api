import {injectable} from "inversify";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {likeStatusPostsIdType, UserType} from "../types/tsTypes";


@injectable()
export class LikeStatusPostsRepository {

  async updateLikeStatusPost(user: UserType, postId: string, likeStatus: string, addedAt: string): Promise<String> {
    const updateLikeStatus = await new MyModelLikeStatusPostsId(
      {
        postId: postId,
        userId: user.accountData.id,
        login: user.accountData.login,
        likeStatus: likeStatus,
        addedAt: addedAt
      })
    try {
      await updateLikeStatus.validate();
    } catch (err: any) {
      console.log(err.toString())
      return "400 " + err.toString()
    }
    updateLikeStatus.save()

    // const update = await MyModelLikeStatusPostsId.findOneAndUpdate(
    //   {
    //     $and:
    //       [
    //         {postId: postId},
    //         {userId: user.accountData.id}
    //       ]
    //   },
    //   {
    //     postId: postId,
    //     userId: user.accountData.id,
    //     login: user.accountData.login,
    //     likeStatus: likeStatus,
    //     addedAt: addedAt,
    //   },
    //   {upsert: true}
    // )
    return "200"
  }
}