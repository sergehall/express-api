import {PostsRepository} from "../repositories/posts-db-repository";
import {Pagination, PostsType, ReturnTypeObjectPosts} from "../types/all_types";


export class PostsService {
  constructor(private postsRepository: PostsRepository) {
    this.postsRepository = postsRepository
  }

  async findPosts(pageNumber: number, pageSize: number): Promise<Pagination>{
    return await this.postsRepository.findPosts(pageNumber, pageSize)
  }
  async findPostsByBloggerId(bloggerId: number, pageNumber: number = 1, pageSize: number = 10, searchNameTerm: string | null = null): Promise<Pagination>{
    return await this.postsRepository.findPostsByBloggerId(bloggerId, pageNumber, pageSize, searchNameTerm)
  }

  async createPost(title: string, shortDescription: string, content: string, bloggerId: number): Promise<ReturnTypeObjectPosts> {
    const newId = Math.round((+new Date()+ +new Date())/2);
    const newPost = {
      id: newId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId: bloggerId,
      bloggerName: ""
    }

    return await this.postsRepository.createPost(newPost)
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