import {BloggerType, ReturnTypeObjectBlogers} from "../types/all_types";
import {BloggersRepository} from "../repositories/bloggers-db-repository";


export class BloggersService {
  constructor(private bloggersRepository: BloggersRepository) {
    this.bloggersRepository = bloggersRepository
  }
  async findBloggers(youtubeUrl: string | null | undefined): Promise<BloggerType[]> {
    return await this.bloggersRepository.findBloggers(youtubeUrl)
  }

  async createNewBlogger(name: string, youtubeUrl: string): Promise<ReturnTypeObjectBlogers> {
    const newId = Math.round((+new Date()+ +new Date())/2);
    const newBlogger = {
      id: newId,
      name: name,
      youtubeUrl: youtubeUrl
    }

    return await this.bloggersRepository.createNewBlogger(newBlogger)
  }

  async getBloggerById(id: number): Promise<BloggerType | null> {
    return await this.bloggersRepository.getBloggerById(id)
  }

  async updateBloggerById(id: number, name: string, youtubeUrl: string): Promise<ReturnTypeObjectBlogers> {
    return await this.bloggersRepository.updateBloggerById(id, name, youtubeUrl);
  }

  async deletedBloggerById(id: number): Promise<boolean> {
    return await this.bloggersRepository.deletedBloggerById(id);

  }
}