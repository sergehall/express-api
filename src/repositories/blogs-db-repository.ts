import {ArrayErrorsType, Pagination} from "../types/all_types";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import uuid4 from "uuid4";
import {MongoHasNotUpdated, notFoundBlogId} from "../middlewares/errorsMessages";
import {MyModelBlogPosts} from "../mongoose/PostsBlogSchemaModel";


export class BlogsRepository {

  async findBlogs(pageNumber: number, pageSize: number, title: string | null, sortBy: string | null, sortDirection: string | null,): Promise<Pagination> {
    let filter = {}
    let sortFilter = {}
    if (title !== null) {
      filter = {title: {$regex: title}}
    }

    if (!sortDirection || sortDirection !== "asc") {
      sortDirection = "desc"
    }
    if (!sortBy || sortBy !== "name" && sortBy !== "youtubeUrl") {
      sortFilter = {"createdAt": sortDirection}
    } else if (sortBy === "name") {
      sortFilter = {"name": sortDirection}
    } else if (sortBy === "youtubeUrl") {
      sortFilter = {"youtubeUrl": sortDirection}
    }


    const startIndex = (pageNumber - 1) * pageSize
    const result = await MyModelBlogs.find(filter, {
      _id: false,
      __v: false
    }).limit(pageSize).skip(startIndex).sort(sortFilter).lean()

    const totalCount = await MyModelBlogs.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: result
    };
  }

  async createBlog(name: string, youtubeUrl: string) {
    let errorsArray: ArrayErrorsType = [];
    const newBlogId = uuid4().toString()
    const createdAt = (new Date()).toISOString()

    const newBlog = {
      id: newBlogId,
      name: name,
      youtubeUrl: youtubeUrl,
      createdAt: createdAt
    }

    const createBlog = await MyModelBlogs.create(newBlog)

    return {
      data: createBlog,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async createNewPostByBlogId(title: string, shortDescription: string, content: string, blogId: string) {
    let errorsArray: ArrayErrorsType = [];

    const filter = {id: blogId}
    const verifyBlogIg = await MyModelBlogs.findOne(filter).lean()

    if (!verifyBlogIg) {
      errorsArray.push(notFoundBlogId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const blogName = verifyBlogIg.name
    const createdAt = (new Date()).toISOString()
    const newPostId = uuid4().toString()

    const newPostBlog = {
      id: newPostId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: createdAt,
    }

    const filterBlogId = {blogId: blogId}
    const foundBlog = await MyModelBlogPosts.findOne(filterBlogId)
    if (!foundBlog) {
      const createNewBlog = await MyModelBlogPosts.create({
        blogId: blogId,
        allPosts: [newPostBlog]
      })
      if (!createNewBlog) {
        errorsArray.push(MongoHasNotUpdated)
      }
    } else {
      const result = await MyModelBlogPosts.updateOne(
        {blogId: blogId},
        {
          $push: {allPosts: newPostBlog}
        })
      if (!result.modifiedCount && !result.matchedCount) {
        errorsArray.push(MongoHasNotUpdated)
      }
    }

    if (errorsArray.length !== 0) {
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    return {
      data: newPostBlog,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }
}






















