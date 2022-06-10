import {ObjectId} from "mongodb";

export type ErrorType = {
  message: string
  field: string
}
export type ArrayErrorsType = Array<ErrorType>
export type BloggerType = {
  id: string | null
  name: string
  youtubeUrl: string
}
export type ReturnTypeObjectBloggers = {
  data: BloggerType,
  errorsMessages: Array<ErrorType>,
  resultCode: number
}
export type PostsType = {
  id: string | null
  title: string
  shortDescription: string
  content: string
  bloggerId: string
  bloggerName: string
}
export type ReturnTypeObjectPosts = {
  data: PostsType,
  errorsMessages: Array<ErrorType>,
  resultCode: number
}
export type BloggerIdAndArrayPosts = [bloggerIdKey: string, posts: Array<PostsType>]
export type AllDeletedPosts = Array<BloggerIdAndArrayPosts>

export type Pagination = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: object
}

export type CommentViewModel = {
  id: string
  content: string
  userId: string
  userLogin: string
  addedAt: string
}

export type ReturnTypeObjectComment = {
  data: CommentViewModel | null,
  errorsMessages: Array<ErrorType>,
  resultCode: number
}

export type UserDBType = {
  _id: object,
  id: string
  login: string
  email: string,
  passwordHash: string,
  passwordSalt: string,
  createdAt: string
}

export type FeedbackDBType = {
  _id: object,
  allFeedbacks: Array<{
    commentId: object,
    comment: string
  }>
}

export type CommentsDBType = {
  postId: string
  allComments: Array<CommentViewModel>
}

export type PaginatorCommentViewModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: Array<CommentViewModel>
}

export type RegistrationDataType = {
  ip: string | null
  createdAt: Array<Date>
}

export type SentEmailType = {
  sendTime: Date
}

export type UserAccountDBType = {
  _id: ObjectId,
  accountData: {
    id: string
    login: string
    email: string
    passwordHash: string
    passwordSalt: string
    createdAt: Date
  }
  emailConfirmation: {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
    sentEmail: [SentEmailType]
  }
  registrationData: Array<RegistrationDataType>
}


export type BlackListIPDBType = {
  ip: string
  countTimes: Array<{
    createdAt: string
  }>
}




