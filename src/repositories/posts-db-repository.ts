import {bloggersCollection, postsCollection,} from "./db";
import {ArrayErrorsType, Pagination, PostsType, ReturnTypeObjectPosts} from "../types/all_types";
import {MongoHasNotUpdated, notFoundBloggerId, notFoundPostId} from "../middlewares/input-validator-middleware";


export class PostsRepository {
  async findPosts(pageNumber: number, pageSize: number): Promise<Pagination> {

    const startIndex = (pageNumber - 1) * pageSize
    const totalCount = await postsCollection.countDocuments()
    const page = pageNumber
    const pagesCount = Math.ceil(totalCount / pageSize)

    const result = await postsCollection.find({}).limit(pageSize).skip(startIndex).toArray()
    // @ts-ignore
    result.map(i => delete i._id)

    return {
      pagesCount: pagesCount,
      page: page,
      pageSize: pageSize,
      totalCount:totalCount,
      items: result
    };
  }

  async findPostsByBloggerId(bloggerId: string | null | undefined, pageNumber: number, pageSize: number, searchNameTerm: string | null): Promise<Pagination> {
    let filter: any = {}
    let bId: number = parseInt(<string>bloggerId)
    if (bloggerId) {
      filter = {bloggerId: bId}
    }
    const found = await postsCollection.find(filter).toArray()
    const startIndex = (pageNumber - 1) * pageSize
    const result = await postsCollection.find(filter).limit(pageSize).skip(startIndex).toArray()

    // @ts-ignore
    result.map(i => delete i._id)

    let totalCount: number = found.length

    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: result
    };

  }

  async createPost(newPost: PostsType): Promise<ReturnTypeObjectPosts> {
    let errorsArray: ArrayErrorsType = [];
    const bloggerId = newPost.bloggerId

    const foundBloggerId = await bloggersCollection.findOne({id: bloggerId})

    if (foundBloggerId === null) {
      errorsArray.push(notFoundBloggerId)
      return {
        data: newPost,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const nameBlogger = await bloggersCollection.find({id: bloggerId}).toArray()
    newPost.bloggerName = nameBlogger[0].name
    const result = await postsCollection.insertOne(newPost)
    if (result) {
      return {
        data: newPost,
        errorsMessages: errorsArray,
        resultCode: 0
      }
    }
    return {
      data: newPost,
      errorsMessages: errorsArray,
      resultCode: 1
    }
  }

  async getPostById(id: number): Promise<PostsType | null> {
    const post: PostsType | null = await postsCollection.findOne({id: id})
    if (post) {
      return post
    } else {
      return null
    }
  }

  async updatePostById(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<ReturnTypeObjectPosts> {
    const searchPost = await postsCollection.findOne({id: id});
    const searchBlogger = await bloggersCollection.findOne({id: bloggerId})
    const errorsArray: ArrayErrorsType = [];
    const data = {
      id: 0,
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId: bloggerId,
      bloggerName: ""
    }

    if (!searchPost) {
      errorsArray.push(notFoundPostId)
    }

    if (!searchBlogger) {
      errorsArray.push(notFoundBloggerId)
    }

    if (searchPost && searchBlogger) {
      const result = await postsCollection.updateOne({id: id}, {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          bloggerId: bloggerId,
          bloggerName: searchBlogger.name
        }
      })
      if (result.matchedCount === 0) {
        errorsArray.push(MongoHasNotUpdated)
      }
    }
    if (errorsArray.length !== 0 || !searchPost) {
      return {
        data: data,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    } else {
      return {
        data: searchPost,
        errorsMessages: errorsArray,
        resultCode: 0
      }
    }
  }

  async deletedById(id: number): Promise<Boolean> {
    const result = await postsCollection.deleteOne({id: id})
    return result.deletedCount === 1
  }

  async deletedAllPosts(): Promise<Boolean> {
    const result = await postsCollection.deleteMany({})
    return result.acknowledged
  }
}