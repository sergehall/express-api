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
export type LastTreeLikes = {
  postId: string
  userId: string
  likeStatus: string
  createdAt: string
}
export type PostsType = {
  id: string
  title: string
  shortDescription: string
  content: string
  bloggerId: string
  bloggerName: string
  addedAt: string
  extendedLikesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes:
      {
        addedAt: string,
        userId: string,
        login: string
      }[]
  }
}

export type ReturnTypeObjectPosts = {
  data: PostsType
  errorsMessages: Array<ErrorType>
  resultCode: number
}

export type TypeBlog = {
  id: string
  name: string
  youtubeUrl: string
  createdAt: string
}
export type ReturnTypeObjectBlog = {
  data: TypeBlog | null
  errorsMessages: Array<ErrorType>
  resultCode: number
}

export type TypeObjectBlogPost = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}
export type ReturnTypeObjectBlogPost = {
  data: TypeObjectBlogPost | null
  errorsMessages: Array<ErrorType>
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
  likesInfo: {
    likesCount: number
    dislikesCount: number
    myStatus: string
  }
}

export type ReturnTypeObjectComment = {
  data: CommentViewModel | null,
  errorsMessages: Array<ErrorType>,
  resultCode: number
}

export type UserDBType = {
  id: string
  login: string
  email: string,
  passwordHash: string,
  passwordSalt: string,
  createdAt: string
}

export type FeedbackDBType = {
  _id: ObjectId,
  allFeedbacks: Array<{
    commentId: ObjectId,
    comment: string
  }>
}

export type PaginatorCommentViewModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: Array<CommentViewModel> | []
}

export type RegistrationDataType = {
  ip: string | null
  createdAt: string
}

export type SentEmailType = {
  sendTime: string
}

export type UserAccountDBType = {
  accountData: {
    id: string
    login: string
    email: string
    passwordHash: string
    passwordSalt: string
    createdAt: string
  }
  emailConfirmation: {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
    sentEmail: [SentEmailType]
  }
  registrationData: Array<RegistrationDataType>
}

export type allUsersReturn = {
  accountData: {
    id: string
    login: string
    email: string | null
    createdAt: string
  }
}

export type allUsersReturnArray = allUsersReturn[]


export type BlackListIPDBType = {
  ip: string
  countTimes: Array<{
    createdAt: Date
  }>
}

export type UserEmailConfirmationCode = {
  email: string
  confirmationCode: string
  createdAt: Date
}

export type BlackListRefreshTokenJWT = {
  refreshToken: string
}

export type PostsExtLikesInfo = {
  id: string
  title: string
  shortDescription: string
  content: string
  bloggerId: string
  bloggerName: string
  addedAt: string
  extendedLikesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes:
      {
        addedAt: string,
        userId: string,
        login: string
      }[]
  }
}

export type ArrayPostsExtLikesInfo = PostsExtLikesInfo[]

export type ArrayCommentsExtLikesInfo = CommentViewModel[]

export type SessionType = {
  userId: string
  ip: string | null
  title: string | undefined
  lastActiveDate: string
  expirationDate: string
  deviceId: string
}

export type SessionTypeArray = {
  ip: string | null
  title: string | undefined
  lastActiveDate: string
  deviceId: string
}[]

export type PayloadType = {
  userId: string
  deviceId: string
  iat: string
  exp: string
}
