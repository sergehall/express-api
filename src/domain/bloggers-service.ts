import {BloggerType, ReturnTypeObjectBloggers} from "../types/all_types";
import {BloggersRepository} from "../repositories/bloggers-db-repository";
import {Pagination} from "../types/all_types";


export class BloggersService {
  constructor(private bloggersRepository: BloggersRepository) {
    this.bloggersRepository = bloggersRepository
  }
  async findBloggers(pageNumber: number,pageSize: number, searchNameTerm: string): Promise<Pagination> {
    return await this.bloggersRepository.findBloggers(pageNumber, pageSize, searchNameTerm)
  }

  async createNewBlogger(name: string, youtubeUrl: string): Promise<ReturnTypeObjectBloggers> {
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

  async updateBloggerById(id: number, name: string, youtubeUrl: string): Promise<ReturnTypeObjectBloggers> {
    return await this.bloggersRepository.updateBloggerById(id, name, youtubeUrl);
  }

  async deletedBloggerById(id: number): Promise<boolean> {
    return await this.bloggersRepository.deletedBloggerById(id);
  }

  async deletedAllBloggers(): Promise<boolean> {
    return await this.bloggersRepository.deletedAllBloggers();
  }
}