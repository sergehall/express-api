import {ArrayErrorsType, Pagination, ReturnTypeObjectBlog, TypeBlog} from "../types/all_types";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import uuid4 from "uuid4";
import {mongoHasNotUpdated, notFoundBlogId} from "../middlewares/errorsMessages";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";


export class BlogsRepository {

  async findBlogs(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null,): Promise<Pagination> {

    if (!sortDirection || sortDirection !== "asc") {
      sortDirection = "desc"
    }
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

  async createBlog(name: string, youtubeUrl: string) {
    let errorsArray: ArrayErrorsType = [];
    const newBlogId = uuid4().toString()
    const createdAt = new Date().toISOString()

    const createBlog = await MyModelBlogs.create({
      id: newBlogId,
      name: name,
      youtubeUrl: youtubeUrl,
      createdAt: createdAt
    })

    return {
      data: createBlog,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  // async createNewPostByBlogId(title: string, shortDescription: string, content: string, blogId: string) {
  //   let errorsArray: ArrayErrorsType = [];
  //
  //   const filter = {id: blogId}
  //   const verifyBlogIg = await MyModelBlogs.findOne(filter).lean()
  //
  //   if (!verifyBlogIg) {
  //     errorsArray.push(notFoundBlogId)
  //     return {
  //       data: null,
  //       errorsMessages: errorsArray,
  //       resultCode: 1
  //     }
  //   }
  //
  //   const blogName = verifyBlogIg.name
  //   const createdAt = new Date().toISOString()
  //   const newPostId = uuid4().toString()
  //
  //   const newPostBlog = {
  //     id: newPostId,
  //     title: title,
  //     shortDescription: shortDescription,
  //     content: content,
  //     blogId: blogId,
  //     blogName: blogName,
  //     createdAt: createdAt,
  //   }
  //
  //   const filterBlogId = {blogId: blogId}
  //   const foundBlog = await MyModelBlogPosts.findOne(filterBlogId)
  //   if (!foundBlog) {
  //     const createNewBlog = await MyModelBlogPosts.create({
  //       blogId: blogId,
  //       allPosts: [newPostBlog]
  //     })
  //     if (!createNewBlog) {
  //       errorsArray.push(MongoHasNotUpdated)
  //     }
  //   } else {
  //     const result = await MyModelBlogPosts.updateOne(
  //       {blogId: blogId},
  //       {
  //         $push: {allPosts: newPostBlog}
  //       })
  //     if (!result.modifiedCount && !result.matchedCount) {
  //       errorsArray.push(MongoHasNotUpdated)
  //     }
  //   }
  //
  //   if (errorsArray.length !== 0) {
  //     return {
  //       data: null,
  //       errorsMessages: errorsArray,
  //       resultCode: 1
  //     }
  //   }
  //
  //   return {
  //     data: newPostBlog,
  //     errorsMessages: errorsArray,
  //     resultCode: 0
  //   }
  // }

  async findAllPostsByBlog(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, blogId: string): Promise<Pagination | null> {
    const filterBlogId = {blogId: blogId}

    if (!sortDirection || sortDirection !== "asc") {
      sortDirection = "desc"
    }
    const direction = sortDirection === "desc" ? -1 : 1;

    let field = "createdAt"
    if (sortBy === "title" || sortBy === "shortDescription" || sortBy === "blogName" || sortBy === "content" || sortBy === "blogName") {
      field = sortBy
    }
    const startIndex = (pageNumber - 1) * pageSize
    const findPostsByBlogId = await MyModelPosts.find(
      filterBlogId,
      {
        _id: false,
        __v: false
      })
      .limit(pageSize)
      .skip(startIndex)
      .sort({[field]: direction}).lean()

    if (!findPostsByBlogId) {
      return null
    }
    //
    // let totalCount = findPostsByBlogId.length
    // console.log(totalCount, "totalCount")

    const totalCount = await MyModelPosts.countDocuments(filterBlogId)
    const pagesCount = Math.ceil(totalCount / pageSize)
    //
    // let desc = -1
    // let asc = 1
    // let field = "createdAt"
    //
    // if (sortDirection !== "asc") {
    //   desc = 1
    //   asc = -1
    // }
    //
    // if (sortBy === "blogName" || sortBy === "shortDescription" || sortBy === "title" || sortBy === "content") {
    //   field = sortBy
    // }
    // console.log(field, "field sortBy out ---------")
    // console.log(sortDirection, "sortDirection out ---------")
    //
    // // sort array posts
    // function byField(field: string, asc: number, desc: number) {
    //   return (a: any, b: any) => a[field] > b[field] ? asc : desc;
    // }
    //
    // // let posts = await MyModelBlogPosts.findOne(filter, {
    // //   _id: false
    // // })
    // //   .then(posts => posts?.allPosts.sort(byField(field, asc, desc)))
    //
    // const sortPosts = findPostsByBlogId.sort(byField(field, asc, desc))
    //
    // // if (!sortPosts) {
    // //   sortPosts = []
    // // }

    // let startIndex = (pageNumber - 1) * pageSize
    // const postsSlice = sortPosts.slice(startIndex, startIndex + pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: findPostsByBlogId
    };
  }

  async findBlogById(id: string): Promise<TypeBlog | null> {
    const foundBlog = await MyModelBlogs.findOne({id: id}, {
      _id: false,
      __v: false,
    }).lean()

    if (!foundBlog) {
      return null
    }
    return foundBlog
  }

  async updatedBlogById(name: string, youtubeUrl: string, id: string): Promise<ReturnTypeObjectBlog> {
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






















