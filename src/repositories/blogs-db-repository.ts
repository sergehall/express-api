import {
  ArrayErrorsType,
  BlogsType,
  Pagination,
  ReturnObjBlogType,
  UserType
} from "../types/types";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import uuid4 from "uuid4";
import {mongoHasNotUpdated, notFoundBlogId} from "../middlewares/errorsMessages";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {ioc} from "../IoCContainer";


export class BlogsRepository {

  async findBlogs(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null,): Promise<Pagination> {
    const direction = sortDirection === "desc" ? 1 : -1;

    let field = "createdAt"
    if (sortBy === "name" || sortBy === "youtubeUrl") {
      field = sortBy
    }

    const startIndex = (pageNumber - 1) * pageSize
    const result = await MyModelBlogs.find(
      {},
      {
        _id: false,
        __v: false
      })
      .limit(pageSize)
      .skip(startIndex)
      .sort({[field]: direction}).lean()

    const totalCount = await MyModelBlogs.countDocuments({})
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: result
    };
  }

  async createBlog(name: string, youtubeUrl: string): Promise<ReturnObjBlogType> {
    let errorsArray: ArrayErrorsType = [];
    const newBlog = {
      id: uuid4().toString(),
      name: name,
      youtubeUrl: youtubeUrl,
      createdAt: new Date().toISOString()
    }
    await MyModelBlogs.create(newBlog)

    return {
      data: newBlog,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async findAllPostsByBlogId(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, blogId: string, currentUser: UserType | null): Promise<Pagination | null> {
    const filterBlogId = {blogId: blogId}

    const direction = sortDirection === "desc" ? 1 : -1;

    let field = "createdAt"
    if (sortBy === "title" || sortBy === "shortDescription" || sortBy === "blogName" || sortBy === "content" || sortBy === "blogName") {
      field = sortBy
    }

    const startIndex = (pageNumber - 1) * pageSize
    const allPostsByBlogId = await MyModelPosts.find(
      filterBlogId,
      {
        _id: false,
        __v: false
      })
      .limit(pageSize)
      .skip(startIndex)
      .sort({[field]: direction}).lean()

    if (!allPostsByBlogId) {
      return null
    }
    await ioc.preparationPostsForReturn.preparationPostsForReturn(allPostsByBlogId, currentUser)

    const totalCount = await MyModelPosts.countDocuments(filterBlogId)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: allPostsByBlogId
    };
  }

  async findBlogById(id: string): Promise<BlogsType | null> {
    const foundBlog = await MyModelBlogs.findOne({id: id}, {
      _id: false,
      __v: false,
    }).lean()

    if (!foundBlog) {
      return null
    }
    return foundBlog
  }

  async updatedBlogById(name: string, youtubeUrl: string, id: string): Promise<ReturnObjBlogType> {
    const errorsArray: ArrayErrorsType = [];
    const createdAt = new Date().toISOString()

    const searchBlog = await MyModelBlogs.findOne({id: id})
    if (!searchBlog) {
      errorsArray.push(notFoundBlogId)
    }
    const updatedBlog = await MyModelBlogs.updateOne({id: id}, {
      $set: {
        id: id,
        name: name,
        youtubeUrl: youtubeUrl,
        createdAt: createdAt
      }
    }).lean()

    if (updatedBlog.matchedCount === 0) {
      errorsArray.push(mongoHasNotUpdated)
    }
    const foundBlog = await MyModelBlogs.findOne(
      {id: id},
      {
        _id: false,
        __v: false,
      }).lean()

    if (errorsArray.length !== 0 || !foundBlog) {
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    return {
      data: foundBlog,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async deletedBlogById(id: string): Promise<Boolean> {
    const result = await MyModelBlogs.deleteOne({id: id})
    return result.deletedCount === 1
  }
}






















