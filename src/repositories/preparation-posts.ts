import {
  PostsType,
  UserType,
} from "../types/tsTypes";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {injectable} from "inversify";

@injectable()
export class PreparationPosts {

  async preparationPostsForReturn(postArray: PostsType[], currentUser: UserType | null): Promise<PostsType[]> {
    const filledPosts: PostsType[] = []
    for (let i in postArray) {
      const postId = postArray[i].id
      const currentPost: PostsType = postArray[i]

      // getting likes count
      const likesCount = await MyModelLikeStatusPostsId.countDocuments({
        $and:
          [{postId: postId},
            {likeStatus: "Like"}]
      }).lean()

      // getting dislikes count
      const dislikesCount = await MyModelLikeStatusPostsId.countDocuments({
        $and:
          [{postId: postId},
            {likeStatus: "Dislike"}]
      }).lean()

      // getting the status of the post owner
      let ownLikeStatus = "None"
      if (currentUser) {
        const findOwnPost = await MyModelLikeStatusPostsId.findOne(
          {
            $and:
              [
                {postId: postId},
                {userId: currentUser.accountData.id}
              ]
          }
        )
        if (findOwnPost) {
          ownLikeStatus = findOwnPost.likeStatus
        }
      }

      // getting 3 last likes
      const newestLikes = await MyModelLikeStatusPostsId.find(
        {
          $and:
            [
              {postId: postId},
              {likeStatus: "Like"}
            ]
        },
        {
          _id: false,
          __v: false,
          postId: false,
          likeStatus: false,
          "extendedLikesInfo.newestLikes._id": false
        })
        .sort({addedAt: -1})
        .limit(3)


      const currentPostWithLastThreeLikes = {
        id: currentPost.id,
        title: currentPost.title,
        shortDescription: currentPost.shortDescription,
        content: currentPost.content,
        blogId: currentPost.blogId,
        blogName: currentPost.blogName,
        createdAt: currentPost.createdAt,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: ownLikeStatus,
          newestLikes: newestLikes
        }
      }

      filledPosts.push(currentPostWithLastThreeLikes)
    }
    return filledPosts
  }
}