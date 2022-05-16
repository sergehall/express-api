import {bloggersCollection, postsCollection,} from "./db";
import {ArrayErrorsType, Pagination, PostsType, ReturnTypeObjectPosts} from "../types/all_types";
import {
  MongoHasNotUpdated,
  notFoundBloggerId,
  notFoundPostId
} from "../middlewares/input-validator-middleware";


export class PostsRepository {

  async findPosts(pageNumber: number, pageSize: number, title: string | null): Promise<Pagination> {
    let filter = {}
    if (title !== null) {
      filter = {title: {$regex: title}}
    }
    const startIndex = (pageNumber - 1) * pageSize
    const result = await postsCollection.find(filter, {
      projection: {
        _id: false
      }
    }).limit(pageSize).skip(startIndex).toArray()

    const totalCount = await postsCollection.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: result
    };
  }

  async findPostsByBloggerId(bloggerId: string, pageNumber: number, pageSize: number): Promise<Pagination> {
    let filter = {}
    if (bloggerId) {
      filter = {bloggerId: bloggerId}
    }
    const startIndex = (pageNumber - 1) * pageSize
    const result = await postsCollection.find(filter, {
      projection: {
        _id: false
      }
    }).limit(pageSize).skip(startIndex).toArray()

    const totalCount = await postsCollection.countDocuments(filter)

    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: result
    };
  }

  async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<ReturnTypeObjectPosts> {
    let errorsArray: ArrayErrorsType = [];
    const newPostId = Math.round((+new Date() + +new Date()) / 2).toString();

    const foundBloggerId = await bloggersCollection.findOne({id: bloggerId})
    if (!foundBloggerId) {
      errorsArray.push(notFoundBloggerId)
    }

    let newPost = {
      id: newPostId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId: bloggerId,
      bloggerName: ""
    }

    if (foundBloggerId) {
      const result = await postsCollection.insertOne(newPost)
      if (result.acknowledged) {
        const nameBloggerId = foundBloggerId.name
        return {
          data: {
            id: newPostId,
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: nameBloggerId
          },
          errorsMessages: errorsArray,
          resultCode: 0
        }
      }
    }
    return {
      data: newPost,
      errorsMessages: errorsArray,
      resultCode: 1
    }
  }

  async getPostById(id: string): Promise<PostsType | null> {
    const post: PostsType | null = await postsCollection.findOne({id: id}, {
      projection: {
        _id: false
      }
    })
    if (post) {
      return post
    } else {
      return null
    }
  }

  async updatePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<ReturnTypeObjectPosts> {
    const searchPost = await postsCollection.findOne({id: id});
    const searchBlogger = await bloggersCollection.findOne({id: bloggerId})
    const errorsArray: ArrayErrorsType = [];

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
    if (errorsArray.length !== 0 || searchPost === null) {
      return {
        data: {
          id: "0",
          title: title,
          shortDescription: shortDescription,
          content: content,
          bloggerId: bloggerId,
          bloggerName: ""
        },
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: searchPost,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async deletedById(id: string): Promise<Boolean> {
    const result = await postsCollection.deleteOne({id: id})
    return result.deletedCount === 1
  }

  async deletedAllPosts(): Promise<Boolean> {
    const result = await postsCollection.deleteMany({})
    return result.acknowledged
  }
}