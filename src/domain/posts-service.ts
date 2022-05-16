import {PostsRepository} from "../repositories/posts-db-repository";
import {Pagination, PostsType, ReturnTypeObjectPosts} from "../types/all_types";


export class PostsService {
  constructor(private postsRepository: PostsRepository) {
    this.postsRepository = postsRepository
  }

  async findPosts(pageNumber: number, pageSize: number, title: string | null): Promise<Pagination>{
    return await this.postsRepository.findPosts(pageNumber, pageSize, title)
  }
  async findPostsByBloggerId(bloggerId: number, pageNumber: number, pageSize: number, searchNameTerm: string | null): Promise<Pagination>{
    return await this.postsRepository.findPostsByBloggerId(bloggerId, pageNumber, pageSize)
  }

  async createPost(title: string, shortDescription: string, content: string, bloggerId: number): Promise<ReturnTypeObjectPosts> {
    return await this.postsRepository.createPost(title, shortDescription, content, bloggerId)
  }

  async getPostById(id: number): Promise<PostsType | null >{
    return await this.postsRepository.getPostById(id)
  }

  async updatePostById(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<ReturnTypeObjectPosts> {
    return await this.postsRepository.updatePostById(id, title, shortDescription, content, bloggerId)
  }

  async deletedById(id: number): Promise<Boolean> {
    return await this.postsRepository.deletedById(id)
  }

  async deletedAllPosts(): Promise<Boolean> {
    return await this.postsRepository.deletedAllPosts()
  }
}