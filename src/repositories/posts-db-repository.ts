import {MongoHasNotUpdated, notFoundBloggerId, notFoundPostId} from "../middlewares/errorsMessages";
import {
  ArrayErrorsType, CommentViewModel,
  LastTreeLikes,
  Pagination,
  PaginatorCommentViewModel,
  PostsType,
  ReturnTypeObjectComment,
  ReturnTypeObjectPosts,
  UserAccountDBType,
} from "../types/all_types";
import {MyModelBloggers} from "../mongoose/BloggersSchemaModel";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import uuid4 from "uuid4";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {MyModelThreeLastLikesPost} from "../mongoose/ThreeLastLikesPost";
import {MyModelUserAccount} from "../mongoose/UsersAccountsSchemaModel";
import {ioc} from "../IoCContainer";


export class PostsRepository {

  async findPosts(pageNumber: number, pageSize: number, title: string | null, user: UserAccountDBType | null): Promise<Pagination> {

    let filter = {}
    if (title !== null) {
      filter = {title: {$regex: title}}
    }
    const startIndex = (pageNumber - 1) * pageSize
    const result = await MyModelPosts.find(filter, {
      _id: false,
      __v: false
    }).limit(pageSize).skip(startIndex).lean()

    await ioc.preparationPostsForReturn.preparationPostsForReturn(result, user)

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

  async findPostsByBloggerId(bloggerId: string, pageNumber: number, pageSize: number, user: UserAccountDBType | null): Promise<Pagination> {
    let filter = {}
    if (bloggerId) {
      filter = {bloggerId: bloggerId}
    }
    const startIndex = (pageNumber - 1) * pageSize
    const result = await MyModelPosts.find(filter, {
      _id: false,
      __v: false
    }).limit(pageSize).skip(startIndex).lean()

    await ioc.preparationPostsForReturn.preparationPostsForReturn(result, user)

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

  async createPost(title: string, shortDescription: string, content: string, bloggerId: string, addedAt: string): Promise<ReturnTypeObjectPosts> {
    let errorsArray: ArrayErrorsType = [];
    const newPostId = uuid4().toString()
    const foundBloggerId = await MyModelBloggers.findOne({id: bloggerId})
    if (!foundBloggerId) {
      errorsArray.push(notFoundBloggerId)
      return {
        data: {
          id: "",
          title: title,
          shortDescription: shortDescription,
          content: content,
          bloggerId: bloggerId,
          bloggerName: "",
          addedAt: addedAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "",
            newestLikes: []
          }
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
      bloggerId: bloggerId,
      bloggerName: nameBloggerId,
      addedAt: addedAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: []
      }
    }

    try {
      const createNewPost = await MyModelPosts.create(newPost)

      if (!createNewPost) {
        throw true
      }
      return {
        data: createNewPost,
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
          bloggerId: bloggerId,
          bloggerName: "",
          addedAt: addedAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "",
            newestLikes: [{
              addedAt: "",
              userId: "",
              login: ""
            }]
          }
        },
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
  }

  async createNewCommentByPostId(postId: string, content: string, user: UserAccountDBType): Promise<ReturnTypeObjectComment> {
    let errorsArray: ArrayErrorsType = [];
    const newCommentId = uuid4().toString()
    const addedAt = (new Date()).toISOString()
    const filter = {id: postId}

    const newComment: CommentViewModel = {
      id: newCommentId,
      content: content,
      userId: user.accountData.id,
      userLogin: user.accountData.login,
      addedAt: addedAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None"
      }
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
      data: newComment,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async getPostById(id: string, user: UserAccountDBType | null): Promise<PostsType | null> {
    const post: PostsType | null = await MyModelPosts.findOne({id: id}, {
      _id: false,
      __v: false
    }).lean()

    if (!post) {
      return null
    }
    const result = [post]

    await ioc.preparationPostsForReturn.preparationPostsForReturn(result, user)

    return post
  }

  async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, user: UserAccountDBType | null): Promise<PaginatorCommentViewModel> {
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

    const filledComments =  await ioc.preparationComments.preparationCommentsForReturn(commentsSlice, user)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filledComments
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
      }).lean()

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
          bloggerId: blogId,
          bloggerName: "",
          addedAt: createdAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "",
            newestLikes: []
          }
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
          bloggerId: blogId,
          bloggerName: "",
          addedAt: createdAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "",
            newestLikes: []
          }

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
      userId: userId,
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

      if (!currentLikeStatus) {
        await MyModelLikeStatusPostsId.create(newLikeStatus)
      }

      const postInThreeLastLikes = await MyModelThreeLastLikesPost.findOne(
        {
          $and:
            [{postId: postId},
              {"threeNewestLikes.userId": userId}]
        }).lean()

      if (currentLikeStatus
        && currentLikeStatus.likeStatus === "Like"
        && likeStatus === "Like"
        && postInThreeLastLikes) {
        return true
      }

      if (likeStatus === 'Like') {
        const newestLikeToThreeLastLikes = {
          addedAt: createdAt,
          userId: user.accountData.id,
          login: user.accountData.login
        }
        const updateCurrentLikeInLikeStatusPosts = await MyModelLikeStatusPostsId.findOneAndUpdate(
          {
            $and:
              [{postId: postId},
                {userId: userId}]
          },
          {likeStatus: likeStatus}).lean()

        const checkPostLastLikes = await MyModelThreeLastLikesPost.findOne({postId: postId}).lean()
        if (!checkPostLastLikes) {
          const createThreeLastLikesArray = await MyModelThreeLastLikesPost.create({
            postId: postId,
            threeNewestLikes: [newestLikeToThreeLastLikes]
          })
          return true
        }

        if (checkPostLastLikes && !postInThreeLastLikes && checkPostLastLikes.threeNewestLikes.length < 3) {

          const result = await MyModelThreeLastLikesPost.findOneAndUpdate(
            {postId: postId},
            {$push: {"threeNewestLikes": newestLikeToThreeLastLikes}})
          return true

        } else if (checkPostLastLikes && !postInThreeLastLikes && checkPostLastLikes.threeNewestLikes.length === 3) {
          const sortArray = checkPostLastLikes.threeNewestLikes.sort(function (a, b) {
            const addedAtA = a.addedAt
            const addedAtB = b.addedAt
            if (addedAtA < addedAtB) //sort the rows in ascending order
              return -1
            if (addedAtA > addedAtB)
              return 1
            return 0
          })

          sortArray.push(newestLikeToThreeLastLikes)

          const result = await MyModelThreeLastLikesPost.findOneAndUpdate(
            {postId: postId},
            {$set: {"threeNewestLikes": sortArray.slice(1)}})
          return true
        }
        return false
      }

      // if likeStatus: Dislike or None
      const updateLikeStatus = await MyModelLikeStatusPostsId.findOneAndUpdate(
        {
          $and:
            [{postId: postId},
              {userId: userId}]
        },
        {likeStatus: likeStatus}).lean()
      const findLikeInThreeLast = await MyModelThreeLastLikesPost.findOne(
        {
          $and:
            [{postId: postId},
              {"threeNewestLikes.userId": userId}]
        }).lean()

      if (!findLikeInThreeLast) {
        return true
      }

      // get array likes by postId
      let findNewestLikeArray = await MyModelLikeStatusPostsId.find({
        $and:
          [{postId: postId},
            {likeStatus: "Like"}]
      }).sort(createdAt).lean()

      async function findLikeNoInThreeLast(findNewestLikeArray: any) {

        while (true) {
          const newestLike = findNewestLikeArray.pop()

          if (newestLike === undefined) {
            break
          }
          const likeNoInThreeLast = await MyModelThreeLastLikesPost.findOne({"threeNewestLikes.userId": newestLike.userId}).lean()
          if (!likeNoInThreeLast) {
            return newestLike
          }
        }
      }

      const findNewestLike: LastTreeLikes = await findLikeNoInThreeLast(findNewestLikeArray)

      if (!findNewestLikeArray && findLikeInThreeLast || !findNewestLike) {
        const removeLikeFromThreeLastLikes = await MyModelThreeLastLikesPost.findOne({
          $and:
            [{postId: postId},
              {"threeNewestLikes.userId": userId}]
        }).lean()

        if (removeLikeFromThreeLastLikes) {
          const delLikesFromThreeLast = removeLikeFromThreeLastLikes.threeNewestLikes.filter(i => i.userId !== userId)
          const updateThreeLastLikes = await MyModelThreeLastLikesPost.findOneAndUpdate(
            {postId: postId},
            {threeNewestLikes: delLikesFromThreeLast}
          )
          return true
        }
      }

      const gettingLoginNewestLike = await MyModelUserAccount.findOne({"accountData.id": findNewestLike.userId}).lean()
      if (!gettingLoginNewestLike) {
        return false
      }

      const updatedThreeLastLikes = await MyModelThreeLastLikesPost.updateOne({
          "threeNewestLikes.userId": userId
        },
        {
          "threeNewestLikes.$.addedAt": findNewestLike.createdAt,
          "threeNewestLikes.$.userId": findNewestLike.userId,
          "threeNewestLikes.$.login": gettingLoginNewestLike.accountData.login
        })

      return true

    } catch (e) {
      console.log(e)
      return false
    }
  }
}
