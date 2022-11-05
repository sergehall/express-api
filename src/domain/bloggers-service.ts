import {ReturnObjectBloggerType} from "../types/all_types";
import {BloggersRepository} from "../repositories/bloggers-db-repository";
import {Pagination} from "../types/all_types";


export class BloggersService {
  constructor(private bloggersRepository: BloggersRepository) {
    this.bloggersRepository = bloggersRepository
  }
  async findBloggers(pageNumber: number,pageSize: number, searchNameTerm: string | null): Promise<Pagination> {
    return await this.bloggersRepository.findBloggers(pageNumber, pageSize, searchNameTerm)
  }

  async createNewBlogger(name: string, youtubeUrl: string): Promise<ReturnObjectBloggerType> {
    return await this.bloggersRepository.createNewBlogger(name, youtubeUrl)
  }

  async getBloggerById(id: string): Promise<ReturnObjectBloggerType> {
    return await this.bloggersRepository.getBloggerById(id)
  }

  async updateBloggerById(id: string, name: string, youtubeUrl: string): Promise<ReturnObjectBloggerType> {
    return await this.bloggersRepository.updateBloggerById(id, name, youtubeUrl);
  }

  async deletedBloggerById(id: string): Promise<boolean> {
    return await this.bloggersRepository.deletedBloggerById(id);
  }

  async deletedAllBloggers(): Promise<boolean> {
    return await this.bloggersRepository.deletedAllBloggers();
  }
}