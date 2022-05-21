import {bloggersCollection, commentsCollection, postsCollection,} from "./db";
import {
  ArrayErrorsType, CommentsDBType,
  Pagination, PaginatorCommentViewModel,
  PostsType,
  ReturnTypeObjectComment,
  ReturnTypeObjectPosts,
  UserDBType,
} from "../types/all_types";
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

  async findPostsByBloggerId(bloggerId: string, pageNumber: number, pageSize: number, searchNameTerm: string | null): Promise<Pagination> {
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

    if (foundBloggerId) {
      const nameBloggerId = foundBloggerId.name
      const newPost = {
        id: newPostId,
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: bloggerId,
        bloggerName: nameBloggerId
      }
      const result = await postsCollection.insertOne(newPost)

      if (!result.acknowledged) {
        errorsArray.push(MongoHasNotUpdated)
      }
      return {
        data: newPost,
        errorsMessages: errorsArray,
        resultCode: 0
      }
    }
    return {
      data: {
        id: newPostId,
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

  async createNewCommentByPostId(postId: string, content: string, user: UserDBType): Promise<ReturnTypeObjectComment> {
    let errorsArray: ArrayErrorsType = [];
    const newCommentId = Math.round((+new Date() + +new Date()) / 2).toString();
    const addedAt = (new Date()).toISOString()
    const filter = {id: postId}

    const newComment = {
      id: newCommentId,
      content: content,
      userId: user.id,
      userLogin: user.login,
      addedAt: addedAt
    }

    const foundPost = await postsCollection.findOne(filter)
    if (!foundPost) {
      errorsArray.push(notFoundPostId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const filterComments = {postId: postId}
    const foundComments = await commentsCollection.findOne(filterComments)
    if (!foundComments) {
      const insertNewComment = await commentsCollection.insertOne({
        postId: postId,
        allComments: [newComment]
      })
      if (!insertNewComment.insertedId) {
        errorsArray.push(MongoHasNotUpdated)
      }
    } else {
      const result = await commentsCollection.updateOne(
        {postId: postId},
        {
          $push: {allComments: newComment}
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
      data: newComment,
      errorsMessages: errorsArray,
      resultCode: 0
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

  async getCommentsByPostId(id: string, pageNumber: number, pageSize: number,): Promise<PaginatorCommentViewModel> {
    let startIndex = (pageNumber - 1) * pageSize
    const filter = {postId: id}

    let foundPost = await postsCollection.findOne({id: id})
    if (foundPost === null) {
      return {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: []
      };
    }

    let totalCount = await commentsCollection.findOne(filter)
      .then(comments => comments?.allComments.length)

    if (!totalCount) {
      totalCount = 0
    }

    const pagesCount = Math.ceil(totalCount / pageSize)

    let comments = await commentsCollection.findOne(filter, {
      projection: {
        _id: false
      }
    })
      .then(comments => comments?.allComments.slice(startIndex, startIndex + pageSize))


    if (!comments) {
      comments = []
    }

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: comments
    };
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
    if (errorsArray.length !== 0 || !searchPost) {
      return {
        data: {
          id: null,
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