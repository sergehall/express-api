import {inject, injectable} from "inversify";
import {TYPES} from "../types/types";
import uuid4 from "uuid4";
import {BlogsRepository} from "../repositories/blogs-db-repository";
import {PostsRepository} from "../repositories/posts-db-repository";
import {PreparationPosts} from "../repositories/preparation-posts";
import {
  ArrayErrorsType,
  BlogsType, DTOBlogsType,
  DTOFindPostsByBlogId,
  Pagination,
  PostsType,
  ReturnObjBlogType,
  UserType
} from "../types/tsTypes";
import {mongoHasNotCreateBlog,
  notFoundBlogId} from "../middlewares/errorsMessages";

@injectable()
export class BlogsService {

  constructor(@inject(TYPES.BlogsRepository) protected blogsRepository: BlogsRepository,
              @inject(TYPES.PostsRepository) protected postsRepository: PostsRepository,
              @inject(TYPES.PreparationPosts) protected preparationPosts: PreparationPosts) {
  }

  async findBlogs(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null): Promise<Pagination> {
    const direction = sortDirection === "asc" ? 1 : -1;

    let field = "createdAt"
    if (sortBy === "name" || sortBy === "websiteUrl") {
      field = sortBy
    }
    const startIndex = (pageNumber - 1) * pageSize
    const dtoBlogs: DTOBlogsType = {
      pageSize: pageSize,
      startIndex: startIndex,
      field: field,
      direction: direction
    }
    const blogs = await this.blogsRepository.findBlogs(dtoBlogs)
    const totalCount = await this.blogsRepository.countDocuments([{}])
    const pagesCount = Math.ceil(totalCount / pageSize)
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs
    };
  }

  async findAllPostsByBlogId(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, blogId: string, currentUser: UserType | null): Promise<Pagination | null> {
    // find all post by blogId
    let filledPosts: PostsType[] = []
    const direction = sortDirection === "asc" ? 1 : -1;

    let field = "createdAt"
    if (sortBy === "title" || sortBy === "shortDescription" || sortBy === "blogName" || sortBy === "content" || sortBy === "blogName") {
      field = sortBy
    }
    const startIndex = (pageNumber - 1) * pageSize
    const dto: DTOFindPostsByBlogId = {
      blogId: blogId,
      pageSize: pageSize,
      startIndex: startIndex,
      field: field,
      direction: direction
    }
    const allPostsByBlogId = await this.postsRepository.findPosts(dto, [{blogId: blogId}])
    if (allPostsByBlogId.length !== 0) {
      filledPosts = await this.preparationPosts.preparationPostsForReturn(allPostsByBlogId, currentUser)
    }
    const totalCount = await this.postsRepository.countDocuments([{blogId: blogId}])
    const pagesCount = Math.ceil(totalCount / pageSize)
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filledPosts
    };
  }

  async createBlog(name: string, websiteUrl: string): Promise<ReturnObjBlogType> {
    let errorsArray: ArrayErrorsType = [];
    const newBlog = {
      id: uuid4().toString(),
      name: name,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString()
    }
    const createNewBlog = this.blogsRepository.createBlog(newBlog)
    if (!createNewBlog) {
      errorsArray.push(mongoHasNotCreateBlog)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: newBlog,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async findBlogById(id: string): Promise<BlogsType | null> {
    return await this.blogsRepository.findBlogById(id)
  }

  async updatedBlogById(name: string, websiteUrl: string, id: string): Promise<ReturnObjBlogType> {
    const errorsArray: ArrayErrorsType = [];
    const newBlog: BlogsType = {
      id: id,
      name: name,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString()
    }
    const blog = await this.blogsRepository.updatedBlogById(id, newBlog)
    if (!blog) {
      errorsArray.push(notFoundBlogId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: newBlog,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async deletedBlogById(id: string): Promise<Boolean> {
    return await this.blogsRepository.deletedBlogById(id)
  }
}