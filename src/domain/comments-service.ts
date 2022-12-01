import {CommentsRepository} from "../repositories/comments-db-repository";
import {
  ArrayErrorsType,
  CommentType, DTOLikeStatusComm, Pagination,
  ReturnObjCommentType,
  UserType
} from "../types/tsTypes";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/types";
import {PostsRepository} from "../repositories/posts-db-repository";
import {PreparationComments} from "../repositories/preparation-comments";
import uuid4 from "uuid4";
import {
  mongoHasNotUpdated,
  notDeletedComment,
  notFoundCommentId,
  notFoundPostId
} from "../middlewares/errorsMessages";
import {LikeStatusCommentsRepository} from "../repositories/likeStatusComment-db-repository";

@injectable()
export class CommentsService {
  constructor(@inject(TYPES.CommentsRepository) protected commentsRepository: CommentsRepository,
              @inject(TYPES.PostsRepository) protected postsRepository: PostsRepository,
              @inject(TYPES.PreparationComments) protected preparationComments: PreparationComments,
              @inject(TYPES.LikeStatusCommentsRepository) protected likeStatusCommentsRepository: LikeStatusCommentsRepository) {
  }

  async findCommentForCompare(commentId: string): Promise<CommentType | null> {
    return await this.commentsRepository.findCommentById(commentId)
  }

  async createNewCommentByPostId(postId: string, content: string, user: UserType): Promise<ReturnObjCommentType> {
    let errorsArray: ArrayErrorsType = [];

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

    if (!await this.postsRepository.findPostByPostId(postId)) {
      errorsArray.push(notFoundPostId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    await this.commentsRepository.createCommentByPostId(postId, newComment)

    return {
      data: newComment,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null, user: UserType | null): Promise<Pagination> {

    const findPost = await this.postsRepository.findPostByPostId(postId)
    if (!findPost) {
      return {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: []
      };
    }
    const allPosts = await this.commentsRepository.findAllCommentsByPostId(postId)
    let allComments: CommentType[] = []
    let totalCount = 0
    let startIndex = (pageNumber - 1) * pageSize
    const pagesCount = Math.ceil(totalCount / pageSize)

    let desc = 1
    let asc = -1
    let field: "userId" | "userLogin" | "content" | "createdAt" = "createdAt"

    if (sortDirection === "asc") {
      desc = -1
      asc = 1
    }
    if (sortBy === "userId" || sortBy === "userLogin" || sortBy === "content") {
      field = sortBy
    }

    if (allPosts) {
      totalCount = allPosts.allComments.length
      allComments = allPosts.allComments.sort(await byField(field, asc, desc))
    }

    async function byField(field: "userId" | "userLogin" | "content" | "createdAt", asc: number, desc: number) {
      return (a: CommentType, b: CommentType) => a[field] > b[field] ? asc : desc;
    }

    const commentsSlice = allComments.slice(startIndex, startIndex + pageSize)
    const filledComments = await this.preparationComments.preparationCommentsForReturn(commentsSlice, user)
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filledComments
    };
  }

  async findCommentByCommentId(commentId: string, currentUser: UserType | null): Promise<ReturnObjCommentType> {
    const errorsArray: ArrayErrorsType = [];

    const findComment = await this.commentsRepository.findCommentById(commentId)

    if (!findComment) {
      errorsArray.push(notFoundCommentId)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    const commentFiledLikesInfo = await this.preparationComments.preparationCommentsForReturn([findComment], currentUser)

    return {
      data: commentFiledLikesInfo[0],
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async updateCommentById(commentId: string, content: string): Promise<ReturnObjCommentType> {
    const errorsArray: ArrayErrorsType = [];
    let resultCode = 0
    const result = await this.commentsRepository.updateCommentById(commentId, content)
    if (!result) {
      errorsArray.push(mongoHasNotUpdated)
      resultCode = 1
    }
    return {
      data: null,
      errorsMessages: errorsArray,
      resultCode: resultCode
    }
  }

  async deletedCommentById(commentId: string): Promise<ReturnObjCommentType> {
    const errorsArray: ArrayErrorsType = [];
    const result = await this.commentsRepository.deletedCommentById(commentId)
    if (!result) {
      errorsArray.push(notDeletedComment)
      return {
        data: null,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: null,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async changeLikeStatusComment(user: UserType, commentId: string, likeStatus: string): Promise<Boolean> {
    const findCommentInDB = await this.commentsRepository.findCommentById(commentId)
    if (!findCommentInDB) {
      return false
    }
    const dtoLikeStatusComm: DTOLikeStatusComm = {
      commentId: commentId,
      userId: user.accountData.id,
      likeStatus: likeStatus,
      createdAt: new Date().toISOString()
    }
    return await this.likeStatusCommentsRepository.updateLikeStatusComment(dtoLikeStatusComm);
  }

}