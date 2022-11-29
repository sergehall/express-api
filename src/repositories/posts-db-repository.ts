import {
 DTOPosts,
  PostsType
} from "../types/tsTypes";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {inject, injectable} from "inversify";
import {PreparationPosts} from "./preparation-posts";
import {TYPES} from "../types/types";


@injectable()
export class PostsRepository {

  constructor(@inject(TYPES.PreparationPosts) protected preparationPosts: PreparationPosts) {
  }

  async findPosts(dtoPosts: DTOPosts): Promise<PostsType[]> {
    return await MyModelPosts.find(
      {},
      {
        _id: false,
        __v: false
      })
      .limit(dtoPosts.pageSize)
      .skip(dtoPosts.startIndex)
      .sort({[dtoPosts.field]: dtoPosts.direction}).lean()
  }

  async findPostByPostId(postId: string) {
    return await MyModelPosts.findOne(
      {id: postId},
      {_id: false, __v: false, "extendedLikesInfo.newestLikes._id": false}).lean()
  }

  async countDocuments([...filters]) {
    return await MyModelPosts.countDocuments({$and: filters})
  }

  async createPost(newPost: PostsType): Promise<PostsType> {
    return await MyModelPosts.create(newPost)
  }

  async updatePostById(newPost: PostsType): Promise<Boolean> {
    const updatePost = await MyModelPosts.findOneAndUpdate(
      {id: newPost.id},
      {
        $set: newPost
      },
      {returnDocument: "after"}).lean()
    return updatePost !== null
  }

  async deletePostById(id: string): Promise<Boolean> {
    const result = await MyModelPosts.deleteOne({id: id})
    // deleted all comments
    await MyModelComments.deleteOne({postId: id})
    return result.deletedCount === 1
  }

  async deletedAllPosts(): Promise<Boolean> {
    const result = await MyModelPosts.deleteMany({})
    return result.acknowledged
  }
}
