import {PostsRepository} from "../repositories/posts-db-repository";
import {
  Pagination,
  PostsType,
  ReturnObjCommentType,
  ReturnObjPostType,
  UserType
} from "../types/types";


export class PostsService {
  constructor(private postsRepository: PostsRepository) {
    this.postsRepository = postsRepository
  }

  async findPosts(pageNumber: number, pageSize: number, sortBy: string| null, sortDirection: string| null, currentUser: UserType | null): Promise<Pagination>{
    return await this.postsRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection, currentUser)
  }

  async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<ReturnObjPostType> {
    return await this.postsRepository.createPost(title, shortDescription, content, blogId)
  }

  async createNewCommentByPostId(postId: string, content: string, user: UserType): Promise<ReturnObjCommentType> {
    return await this.postsRepository.createNewCommentByPostId(postId, content, user)
  }

  async getPostById(postId: string, user: UserType | null): Promise<PostsType | null >{
    return await this.postsRepository.getPostById(postId, user)
  }
  async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, user: UserType | null): Promise<Pagination>{
    return await this.postsRepository.getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection, user)
  }

  async updatePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<ReturnObjPostType> {
    return await this.postsRepository.updatePostById(id, title, shortDescription, content, bloggerId)
  }

  async deletedById(id: string): Promise<Boolean> {
    return await this.postsRepository.deletePostById(id)
  }

  async deletedAllPosts(): Promise<Boolean> {
    return await this.postsRepository.deletedAllPosts()
  }

  async changeLikeStatusPost(user: UserType, postId: string, likeStatus: string): Promise<Boolean> {
    return await this.postsRepository.changeLikeStatusPost(user, postId, likeStatus)
  }
}