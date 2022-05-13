import {PostsRepository} from "../repositories/posts-db-repository";
import {PostsType, ReturnTypeObjectPosts} from "../types/all_types";


export class PostsService {
  constructor(private postsRepository: PostsRepository) {
    this.postsRepository = postsRepository
  }

  async findPosts(title: string | null | undefined): Promise<PostsType[]>{
    return await this.postsRepository.findPosts(title)
  }
  async findPostsByBloggerId(bloggerId: string | null | undefined): Promise<PostsType[]>{
    return await this.postsRepository.findPostsByBloggerId(bloggerId)
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