import {
  mongoHasNotUpdated,
  notFoundBloggerId,
  notFoundBlogId,
  notFoundPostId
} from "../middlewares/errorsMessages";
import uuid4 from "uuid4";
import {
  ArrayErrorsType,
  Pagination,
  PostsType,
  ReturnObjCommentType,
  ReturnObjPostType,
  UserType
} from "../types/tsTypes";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import {inject, injectable} from "inversify";
import {PreparationPosts} from "./preparation-posts";
import {PreparationComments} from "./preparation-comments";
import {TYPES} from "../types";


@injectable()
export class PostsRepository {

  constructor(@inject(TYPES.PreparationPosts) protected preparationPosts: PreparationPosts,
              @inject(TYPES.PreparationComments) protected preparationComments: PreparationComments) {
  }

  async findPosts(pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, currentUser: UserType | null): Promise<Pagination> {
    const direction = sortDirection === "desc" ? 1 : -1;

    let field = "createdAt"
    if (sortBy === "title" || sortBy === "shortDescription" || sortBy === "blogId" || sortBy === "blogName" || sortBy === "content" || sortBy === "blogName") {
      field = sortBy
    }

    const startIndex = (pageNumber - 1) * pageSize
    const findAllPosts = await MyModelPosts.find(
      {},
      {
        _id: false,
        __v: false
      })
      .limit(pageSize)
      .skip(startIndex)
      .sort({[field]: direction}).lean()

    const filledPost = await this.preparationPosts.preparationPostsForReturn(findAllPosts, currentUser)

    const totalCount = await MyModelPosts.countDocuments({})
    const pagesCount = Math.ceil(totalCount / pageSize)


    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filledPost
    };
  }

  async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<ReturnObjPostType> {
    let errorsArray: ArrayErrorsType = [];
    const newPostId = uuid4().toString()
    const createdAt = new Date().toISOString()

    const foundBlogId = await MyModelBlogs.findOne({id: blogId})
    if (!foundBlogId) {
      errorsArray.push(notFoundBlogId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const newPost = {
      id: newPostId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: foundBlogId.name,
      createdAt: createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: []

      }
    }

    try {
      // create post
      const createNewPost: PostsType = await MyModelPosts.create(
        newPost)

      if (!createNewPost.createdAt) {
        errorsArray.push(mongoHasNotUpdated)
        return {
          data: null,
          errorsMessages: errorsArray,
          resultCode: 1
        }
      }
      return {
        data: newPost,
        errorsMessages: errorsArray,
        resultCode: 0
      }

    } catch (e: any) {
      console.log(e)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
  }

  async createNewCommentByPostId(postId: string, content: string, user: UserType): Promise<ReturnObjCommentType> {
    try {
      let errorsArray: ArrayErrorsType = [];

      if (!await MyModelPosts.findOne({id: postId})) {
        errorsArray.push(notFoundPostId)
        return {
          data: null,
          errorsMessages: errorsArray,
          resultCode: 1
        }
      }

      const newComment = {
        id: uuid4().toString(),
        content: content,
        userId: user.accountData.id,
        userLogin: user.accountData.login,
        createdAt: new Date().toISOString(),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None"
        }
      }

      await MyModelComments.findOneAndUpdate(
        {postId: postId},
        {
          $push: {allComments: newComment}
        },
        {upsert: true}
      )

      return {
        data: newComment,
        errorsMessages: errorsArray,
        resultCode: 0
      }

    } catch (e) {
      console.log(e)
      return {
        data: null,
        errorsMessages: [{
          message: 'catch error in createNewCommentByPostId',
          field: "error"
        }],
        resultCode: 1
      }
    }
  }

  async getPostById(postId: string, user: UserType | null): Promise<PostsType | null> {

    const post: PostsType | null = await MyModelPosts.findOne({id: postId}, {
      _id: false,
      __v: false
    }).lean()

    if (!post) {
      return null
    }
    if (!user) {
      return post
    }
    const filledPost = await this.preparationPosts.preparationPostsForReturn([post], user)
    return filledPost[0]
  }

  async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, user: UserType | null): Promise<Pagination> {
    const filter = {postId: postId}

    let foundPost = await MyModelPosts.findOne({id: postId}).lean()

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

    const filledComments = await this.preparationComments.preparationCommentsForReturn(commentsSlice, user)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filledComments
    };
  }

  async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<ReturnObjPostType> {
    const errorsArray: ArrayErrorsType = [];

    const findBlog = await MyModelBlogs.findOne({id: blogId})
    if (!findBlog) {
      errorsArray.push(notFoundBloggerId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    const updatePost = await MyModelPosts.findOneAndUpdate(
      {id: id},
      {
        $set: {
          id: id,
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
          blogName: findBlog.name,
        }
      },
      {returnDocument: "after"}).lean()

    if (!updatePost) {
      errorsArray.push(mongoHasNotUpdated)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: updatePost,
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

  async changeLikeStatusPost(user: UserType, postId: string, likeStatus: string): Promise<Boolean> {
    const userId = user.accountData.id
    const addedAt = new Date().toISOString()

    try {
      const findPostInPostDB = await MyModelPosts.findOne({id: postId})
      if (!findPostInPostDB) {
        return false
      }

      // change like status
      await MyModelLikeStatusPostsId.findOneAndUpdate(
        {
          $and:
            [
              {postId: postId},
              {userId: userId}
            ]
        },
        {
          postId: postId,
          userId: user.accountData.id,
          login: user.accountData.login,
          likeStatus: likeStatus,
          addedAt: addedAt,
        },
        {upsert: true}
      ).lean()
      return true

    } catch (e) {
      console.log(e)
      return false
    }
  }
}
