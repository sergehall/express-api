
import {BlogsRepository} from "../repositories/blogs-db-repository";
import {Pagination, ReturnTypeObjectBlog, ReturnTypeObjectBlogPost} from "../types/all_types";

export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {
    this.blogsRepository = blogsRepository
  }

  async findBlogs(pageNumber: number, pageSize: number, title: string | null, sortBy: string| null, sortDirection: string| null,): Promise<Pagination> {
    return await this.blogsRepository.findBlogs(pageNumber, pageSize, title, sortBy, sortDirection)
  }

  async createBlog(name: string, youtubeUrl: string): Promise<ReturnTypeObjectBlog> {
    return await this.blogsRepository.createBlog(name, youtubeUrl)
  }

  async createNewPostByBlogId(title: string, shortDescription: string, content: string, blogId: string): Promise<ReturnTypeObjectBlogPost> {
    return await this.blogsRepository.createNewPostByBlogId(title, shortDescription, content, blogId)
  }
}