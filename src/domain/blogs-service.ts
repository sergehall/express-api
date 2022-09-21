
import {BlogsRepository} from "../repositories/blogs-db-repository";
import {
  Pagination,
  ReturnTypeObjectBlog,
  ReturnTypeObjectBlogPost,
  TypeBlog
} from "../types/all_types";

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
  
  async getAllPostsByBlog(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, blogId: string): Promise<Pagination | null> {
    return await this.blogsRepository.findAllPostsByBlog(pageNumber, pageSize, sortBy, sortDirection, blogId)
  }
  
  async findBlogById(id: string): Promise<TypeBlog | null> {
    return await this.blogsRepository.findBlogById(id)
  }

  async updatedBlogById(name: string, youtubeUrl: string, id: string): Promise<ReturnTypeObjectBlog>{
    return await this.blogsRepository.updatedBlogById(name, youtubeUrl, id)
  }

  async deletedBlogById(id: string): Promise<Boolean> {
    return await this.blogsRepository.deletedBlogById(id)
  }
}