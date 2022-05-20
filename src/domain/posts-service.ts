import {PostsRepository} from "../repositories/posts-db-repository";
import {
  Pagination,
  PostsType,
  ReturnTypeObjectComment,
  ReturnTypeObjectPosts,
  UserDBType
} from "../types/all_types";


export class PostsService {
  constructor(private postsRepository: PostsRepository) {
    this.postsRepository = postsRepository
  }

  async findPosts(pageNumber: number, pageSize: number, title: string | null): Promise<Pagination>{
    return await this.postsRepository.findPosts(pageNumber, pageSize, title)
  }
  async findPostsByBloggerId(bloggerId: string, pageNumber: number, pageSize: number, searchNameTerm: string | null): Promise<Pagination>{
    return await this.postsRepository.findPostsByBloggerId(bloggerId, pageNumber, pageSize, searchNameTerm)
  }

  async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<ReturnTypeObjectPosts> {
    return await this.postsRepository.createPost(title, shortDescription, content, bloggerId)
  }

  async createNewCommentByPostId(postId: string, content: string, user: UserDBType): Promise<ReturnTypeObjectComment> {
    return await this.postsRepository.createNewCommentByPostId(postId, content, user)
  }

  async getPostById(id: string): Promise<PostsType | null >{
    return await this.postsRepository.getPostById(id)
  }

  async updatePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<ReturnTypeObjectPosts> {
    return await this.postsRepository.updatePostById(id, title, shortDescription, content, bloggerId)
  }

  async deletedById(id: string): Promise<Boolean> {
    return await this.postsRepository.deletedById(id)
  }

  async deletedAllPosts(): Promise<Boolean> {
    return await this.postsRepository.deletedAllPosts()
  }
}