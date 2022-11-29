import {PostsRepository} from "../repositories/posts-db-repository";
import {
  ArrayErrorsType,
  DTOPosts,
  Pagination,
  PostsType,
  ReturnObjPostType,
  UserType
} from "../types/tsTypes";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/types";
import {PreparationPosts} from "../repositories/preparation-posts";
import uuid4 from "uuid4";
import {BlogsRepository} from "../repositories/blogs-db-repository";
import {mongoHasNotUpdated, notFoundBlogId} from "../middlewares/errorsMessages";
import {LikeStatusPostsRepository} from "../repositories/likeStatusPosts-db-repository";


@injectable()
export class PostsService {
  constructor(@inject(TYPES.PostsRepository) protected postsRepository: PostsRepository,
              @inject(TYPES.PreparationPosts) protected preparationPosts: PreparationPosts,
              @inject(TYPES.BlogsRepository) protected blogsRepository: BlogsRepository,
              @inject(TYPES.LikeStatusPostsRepository) protected likeStatusPostsRepository: LikeStatusPostsRepository) {
  }

  async findPosts(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, currentUser: UserType | null): Promise<Pagination> {
    const direction = sortDirection === "asc" ? 1 : -1;

    let field = "createdAt"
    if (sortBy === "title" || sortBy === "shortDescription" || sortBy === "blogId" || sortBy === "blogName" || sortBy === "content" || sortBy === "blogName") {
      field = sortBy
    }
    const startIndex = (pageNumber - 1) * pageSize
    const dtoPosts: DTOPosts = {
      pageSize: pageSize,
      startIndex: startIndex,
      field: field,
      direction: direction
    }
    const posts = await this.postsRepository.findPosts(dtoPosts, [{}])
    const filledPost = await this.preparationPosts.preparationPostsForReturn(posts, currentUser)
    const totalCount = await this.postsRepository.countDocuments([{}])
    const pagesCount = Math.ceil(totalCount / pageSize)
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filledPost
    };
  }

  async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<ReturnObjPostType> {
    let errorsArray: ArrayErrorsType = [];

    const findBlog = await this.blogsRepository.findBlogById(blogId)
    if (!findBlog) {
      errorsArray.push(notFoundBlogId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const newPost: PostsType = {
      id: uuid4().toString(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: findBlog.name,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: []
      }
    }

    const createPost: PostsType = await this.postsRepository.createPost(newPost)
    if (!createPost.createdAt) {
      errorsArray.push(mongoHasNotUpdated)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: newPost,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async getPostById(postId: string, user: UserType | null): Promise<PostsType | null> {
    const findPost = await this.postsRepository.findPostByPostId(postId)

    if (!findPost) {
      return null
    }

    const filledPost = await this.preparationPosts.preparationPostsForReturn([findPost], user)

    return filledPost[0]
  }

  async updatePostById(newId: string, newTitle: string, newShortDescription: string, newContent: string, newBlogId: string): Promise<ReturnObjPostType> {
    const errorsArray: ArrayErrorsType = [];
    const findBlog = await this.blogsRepository.findBlogById(newBlogId)
    if (!findBlog) {
      errorsArray.push(notFoundBlogId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    const newPost: PostsType = {
      id: newId,
      title: newTitle,
      shortDescription: newShortDescription,
      content: newContent,
      blogId: newBlogId,
      blogName: findBlog.name,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: []
      }
    }

    const updatePost = await this.postsRepository.updatePostById(newPost)
    if (!updatePost) {
      errorsArray.push(mongoHasNotUpdated)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: newPost,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async deletePostById(id: string): Promise<Boolean> {
    return await this.postsRepository.deletePostById(id)
  }

  async deletedAllPosts(): Promise<Boolean> {
    return await this.postsRepository.deletedAllPosts()
  }

  async changeLikeStatusPost(user: UserType, postId: string, likeStatus: string): Promise<Boolean> {
    const addedAt = new Date().toISOString()

    const findPostInPostDB = await this.postsRepository.findPostByPostId(postId)
    if (!findPostInPostDB) {
      return false
    }
    return await this.likeStatusPostsRepository.updateLikeStatusPost(user, postId, likeStatus, addedAt);
  }
}