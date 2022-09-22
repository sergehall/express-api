import {MongoHasNotUpdated, notFoundBloggerId, notFoundPostId} from "../middlewares/errorsMessages";
import {
  ArrayErrorsType,
  Pagination, PaginatorCommentViewModel,
  PostsType,
  ReturnTypeObjectComment,
  ReturnTypeObjectPosts, UserAccountDBType,
} from "../types/all_types";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {MyModelBloggers} from "../mongoose/BloggersSchemaModel";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import uuid4 from "uuid4";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";



export class PostsRepository {

  async findPosts(pageNumber: number, pageSize: number, title: string | null): Promise<Pagination> {
    let filter = {}
    if (title !== null) {
      filter = {title: {$regex: title}}
    }
    const startIndex = (pageNumber - 1) * pageSize
    const result = await MyModelPosts.find(filter, {
        _id: false
    }).limit(pageSize).skip(startIndex).lean()

    const totalCount = await MyModelPosts.countDocuments(filter)
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
    const result = await MyModelPosts.find(filter, {
        _id: false
    }).limit(pageSize).skip(startIndex).lean()

    const totalCount = await MyModelPosts.countDocuments(filter)

    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: result
    };
  }

  async createPost(title: string, shortDescription: string, content: string, blogId: string, createdAt: string): Promise<ReturnTypeObjectPosts> {
    let errorsArray: ArrayErrorsType = [];
    const newPostId = uuid4().toString()

    const foundBloggerId = await MyModelBlogs.findOne({id: blogId})
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
        blogId: blogId,
        bloggerName: nameBloggerId,
        createdAt: createdAt
      }
      const result = await MyModelPosts.create(newPost)

      if (!result) {
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
        blogId: blogId,
        bloggerName: "",
        createdAt: createdAt
      },
      errorsMessages: errorsArray,
      resultCode: 1
    }
  }

  async createNewCommentByPostId(postId: string, content: string, user: UserAccountDBType): Promise<ReturnTypeObjectComment> {
    let errorsArray: ArrayErrorsType = [];
    const newCommentId = uuid4().toString()
    const createdAt = (new Date()).toISOString()
    const filter = {id: postId}

    const newComment = {
      id: newCommentId,
      content: content,
      userId: user.accountData.id,
      userLogin: user.accountData.login,
      createdAt: createdAt
    }

    const foundPost = await MyModelPosts.findOne(filter)
    if (!foundPost) {
      errorsArray.push(notFoundPostId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const filterComments = {postId: postId}
    const foundComments = await MyModelComments.findOne(filterComments)
    if (!foundComments) {
      const insertNewComment = await MyModelComments.create({
        postId: postId,
        allComments: [newComment]
      })
      if (!insertNewComment) {
        errorsArray.push(MongoHasNotUpdated)
      }
    } else {
      const result = await MyModelComments.updateOne(
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
      data: {
        id: newCommentId,
        content: content,
        userId: user.accountData.id,
        userLogin: user.accountData.login,
        createdAt: createdAt
      },
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async getPostById(id: string): Promise<PostsType | null> {
    const post: PostsType | null = await MyModelPosts.findOne({id: id}, {
        _id: false
    })
    if (post) {
      return post
    } else {
      return null
    }
  }

  async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null): Promise<PaginatorCommentViewModel> {
    let startIndex = (pageNumber - 1) * pageSize
    const filter = {postId: postId}

    let foundPost = await MyModelPosts.findOne({id: postId})
    if (foundPost === null) {
      return {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: []
      };
    }

    let totalCount = await MyModelComments.findOne(filter)
      .then(comments => comments?.allComments.length)

    if (!totalCount) {
      totalCount = 0
    }

    const pagesCount = Math.ceil(totalCount / pageSize)

    let comments = await MyModelComments.findOne(filter, {
        _id: false
    }).lean()
      .then(comments => comments?.allComments.slice(startIndex, startIndex + pageSize))


    if (!comments) {
      comments = []
    }

    // @ts-ignore
    const allCommentsDelMongoId = comments.map(({_id, ...rest}) => {
      return rest;
    });

    let desc = +1
    let asc = -1
    let field = "createdAt"

    if (!sortDirection || sortDirection !== "asc") {
      desc = -1
      asc = 1
    }

    if (sortBy === "userId" || sortBy === "userLogin" || sortBy === "content") {
      field = sortBy
    }

    // sort array comments
    function byField(field: string) {
      return (a: any, b: any) => a[field] > b[field] ? asc : desc;
    }

    allCommentsDelMongoId.sort(byField(field))

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: allCommentsDelMongoId
    };
  }

  async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<ReturnTypeObjectPosts> {
    const searchPost = await MyModelPosts.findOne({id: id},{
      _id: false,
      __v: false,
    }).lean();
    const searchBlogger = await MyModelBloggers.findOne({id: blogId})
    const errorsArray: ArrayErrorsType = [];
    const createdAt = (new Date()).toISOString()

    if (!searchPost) {
      errorsArray.push(notFoundPostId)
    }
    if (!searchBlogger) {
      errorsArray.push(notFoundBloggerId)
    }
    if (searchPost && searchBlogger) {
      const result = await MyModelPosts.updateOne({id: id}, {
        $set: {
          id: id,
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
          bloggerName: searchBlogger.name,
          createdAt: createdAt
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
          blogId: blogId,
          bloggerName: "",
          createdAt: createdAt
        },
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const foundUpdatedPost = await MyModelPosts.findOne({id: id},{
      _id: false,
    }).lean();

    if(foundUpdatedPost === null) {
      return {
        data: {
          id: null,
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
          bloggerName: "",
          createdAt: createdAt
        },
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: foundUpdatedPost,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async deletePostById(id: string): Promise<Boolean> {
    const result = await MyModelPosts.deleteOne({id: id})
    // deleted all comments
    await MyModelComments.deleteOne({postId: id})
    return result.deletedCount === 1
  }

  async deletedAllPosts(): Promise<Boolean> {
    const result = await MyModelPosts.deleteMany({})
    return result.acknowledged
  }
}