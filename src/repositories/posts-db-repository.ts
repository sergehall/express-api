import {
  MongoHasNotUpdated,
  notFoundBloggerId,
  notFoundPostId
} from "../middlewares/errorsMessages";
import {
  ArrayErrorsType,
  Pagination, PaginatorCommentViewModel,
  PostsType,
  ReturnTypeObjectComment,
  ReturnTypeObjectPosts, UserAccountDBType,
} from "../types/all_types";
import {MyModelBloggers} from "../mongoose/BloggersSchemaModel";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import uuid4 from "uuid4";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";


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
      return {
        data: {
          id: "",
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


    try {
      const result = await MyModelPosts.create(newPost)
      return {
        data: newPost,
        errorsMessages: errorsArray,
        resultCode: 0
      }

    } catch (e) {
      console.log(e)
      errorsArray.push(MongoHasNotUpdated)
      return {
        data: {
          id: "",
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

    let desc = 1
    let asc = -1
    let field = "createdAt"

    if (sortDirection === "asc") {
      desc = -1
      asc = 1
    }
    if (sortBy === "userId" || sortBy === "userLogin" || sortBy === "content") {
      field = sortBy
    }

    // sort array comments
    function byField(field: string, asc: number, desc: number) {
      return (a: any, b: any) => a[field] > b[field] ? asc : desc;
    }

    let comments = await MyModelComments.findOne(filter, {
      _id: false, 'allComments._id': false
    }).lean()
      .then(comments => comments?.allComments.sort(byField(field, asc, desc)))

    if (!comments) {
      comments = []
    }

    let startIndex = (pageNumber - 1) * pageSize
    const commentsSlice = comments.slice(startIndex, startIndex + pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: commentsSlice
    };
  }

  async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<ReturnTypeObjectPosts> {
    const searchPost = await MyModelPosts.findOne({id: id}, {
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
        }
      })
      if (result.matchedCount === 0) {
        errorsArray.push(MongoHasNotUpdated)
      }
    }
    if (errorsArray.length !== 0 || !searchPost) {
      return {
        data: {
          id: "",
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
          bloggerName: "",
          createdAt: createdAt,
        },
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const foundUpdatedPost = await MyModelPosts.findOne({id: id}, {
      _id: false,
    }).lean();

    if (foundUpdatedPost === null) {
      return {
        data: {
          id: "",
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
          bloggerName: "",
          createdAt: createdAt,
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

  async changeLikeStatusPost(user: UserAccountDBType, postId: string, likeStatus: string): Promise<Boolean> {
    const userId = user.accountData.id
    const createdAt = (new Date()).toISOString()

    const newLikeStatus = {
      postId: postId,
      userId: user.accountData.id,
      likeStatus: likeStatus,
      createdAt: createdAt,
    }

    try {
      const findPostInPostDB = await MyModelPosts.findOne({id: postId})
      if (!findPostInPostDB) {
        return false
      }

      const currentLikeStatus = await MyModelLikeStatusPostsId.findOne(
        {
          $and:
            [{postId: postId},
              {userId: userId}]
        }).lean()

      if (currentLikeStatus && currentLikeStatus.likeStatus === likeStatus) {
        return true
      }

      if (!currentLikeStatus) {
        const createNewLikeStatus = await MyModelLikeStatusPostsId.create(newLikeStatus)
        return true
      }
      const updateLikeStatus = await MyModelLikeStatusPostsId.findOneAndUpdate(
        {
          $and:
            [{postId: postId},
              {userId: userId}]
        },
        {likeStatus: likeStatus}).lean()
      return true

    } catch (e) {
      console.log(e)
      return false
    }
  }
}
