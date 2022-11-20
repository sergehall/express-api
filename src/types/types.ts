//...............................................Errors
import {ObjectId} from "mongodb";

export type ErrorType = {
  message: string
  field: string
}
export type ArrayErrorsType = ErrorType[]

//...............................................User and extended UserAccount
export type UserType = {
  accountData: {
    id: string
    login: string
    email: string
    passwordHash: string
  },
  emailConfirmation: {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
    sentEmail: TimeISOType[];
  },
  registrationData: {
    ip: string | null
    userAgent: string
    createdAt: string
  }
}
export type TimeISOType = string
export type UserTestOldType = {
  id: string
  login: string
  email: string
  passwordHash: string
  createdAt: string
}
export type UserTestType = {
  _id: ObjectId,
  accountData: {
    id: string
    login: string
    email: string
    passwordHash: string
  },
  emailConfirmation: {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
    sentEmail: TimeISOType[];
  },
  registrationData: {
    ip: string | null
    userAgent: string
    createdAt: string
  }
}
//...............................................Blogs
export type BlogsType = {
  id: string
  name: string
  websiteUrl: string
  createdAt: string
}
export type ReturnObjBlogType = {
  data: BlogsType | null
  errorsMessages: ErrorType[]
  resultCode: number
}
export type BlogPostsType = {
  blogId: string;
  allPosts: {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    addedAt: string
  }[]
}

//...............................................Posts
export type PostsType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes:
      {
        addedAt: string
        userId: string
        login: string
      }[]
  }
}
export type ReturnObjPostType = {
  data: PostsType | null
  errorsMessages: ErrorType[]
  resultCode: number
}
export type AllDeletedPostsType = {
  bloggerIdKey: string
  posts: {
    id: string | null
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
  }[]
}
export type PostsExtLikesInfo = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
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
export type BloggerIdAndArrayPosts = [bloggerIdKey: string, posts: PostsType[]]
export type AllDeletedPosts = BloggerIdAndArrayPosts[]

//...............................................Comments
export type CommentType = {
  id: string
  content: string
  userId: string
  userLogin: string
  createdAt: string
  likesInfo: {
    likesCount: number
    dislikesCount: number
    myStatus: string
  }
}
export type CommentsTypeModel = {
  postId: string
  allComments: CommentType[]
}
export type ReturnObjCommentType = {
  data: CommentType | null
  errorsMessages: ErrorType[]
  resultCode: number
}
export type ArrayCommentsExtLikesInfo = CommentType[]

//...............................................Emails
export type EmailConfirmCodeType = {
  email: string
  confirmationCode: string
  createdAt: string
}
export type EmailRecoveryCodeType = {
  email: string
  recoveryCode: string
  createdAt: string
}
//...............................................Last10secReq
export type Last10secReq = {
  ip: string
  createdAt: string
}

//...............................................Feedbacks
export type FeedbacksTypeModel = {
  id: string
  allFeedbacks: {
    commentId: string
    comment: string
  }[]
}
export type ReturnTypeObjectFeedback = {
  data: FeedbacksTypeModel | null
  errorsMessages: ErrorType[]
  resultCode: number
}

//...............................................Devices
export type DevicesSchemaModel = {
  userId: string
  ip: string
  title: string
  lastActiveDate: string
  expirationDate: string
  deviceId: string
}
//...............................................LastTreeLikes
export type LastTreeLikes = {
  postId: string
  userId: string
  likeStatus: string
  createdAt: string
}
//...............................................Pagination
export type Pagination = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: object
}
//...............................................Registration
export type RegistrationDataType = {
  ip: string | null
  createdAt: string
}

//...............................................BlackList
export type BlackListRefreshTokenJWT = {
  refreshToken: string
  expirationDate: string
}
export type BlackListIPDBType = {
  ip: string
  addedAt: string
}
//...............................................likeStatus
export type likeStatusCommentIdType = {
  commentId: string
  userId: string
  likeStatus: string
  createdAt: string
}
export type likeStatusPostsIdType = {
  postId: string
  userId: string
  likeStatus: string
  createdAt: string
}
export type ThreeLastLikesPostType = {
  postId: string
  threeNewestLikes: {
    addedAt: string
    userId: string
    login: string
  }[]
}
//...............................................Session
export type SessionTypeArray = {
  ip: string | null
  title: string | undefined
  lastActiveDate: string
  deviceId: string
}[]
export type SessionDevicesType = {
  userId: string
  ip: string | null
  userAgent: string
  lastActiveDate: string
  expirationDate: string
  deviceId: string
}
export type FilterUpdateDevicesType = {
  userId: string
  deviceId: string
}
//...............................................JWT Payload
export type PayloadType = {
  userId: string
  deviceId: string
  iat: number
  exp: number
}