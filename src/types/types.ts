//...............................................Errors
export type ErrorType = {
  message: string
  field: string
}
export type ArrayErrorsType = ErrorType[]

//...............................................User and extended UserAccount
export type UserDBType = {
  id: string
  login: string
  email: string
  passwordHash: string
  passwordSalt: string
  createdAt: string
}

export type UserAccountType = {
  accountData: {
    id: string
    login: string
    email: string
    passwordSalt: string
    passwordHash: string
    createdAt: string
  },
  emailConfirmation: {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
    sentEmail: SentEmailType[];
  },
  registrationData: {
    ip: string | null
    createdAt: string
  }[]
}
export type UserType = {
  id: string
  login: string
  email: string
  passwordHash: string
  passwordSalt: string
  createdAt: string
}

//...............................................Bloggers and Blogs
export type BloggerType = {
  id: string | null
  name: string;
  youtubeUrl: string;
}
export type ReturnObjectBloggerType = {
  data: BloggerType,
  errorsMessages: ArrayErrorsType,
  resultCode: number
}
export type BlogsType = {
  id: string
  name: string
  youtubeUrl: string
  createdAt: string
}
export type ReturnObjectBlogType = {
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
export type PostsType =  {
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
export type ReturnObjectPostsType = {
  data: PostsType
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
export type ReturnTypeObjectComment = {
  data: CommentType | null
  errorsMessages: ErrorType[]
  resultCode: number
}
export type ArrayCommentsExtLikesInfo = CommentType[]

//...............................................Emails
export type EmailsRecoveryCode = {
  email: string
  recoveryCode: string
  createdAt: string
}
export type EmailsToSent = {
  email: string
  confirmationCode: string
  createdAt: string
}
export type SentEmailType = {
  sendTime: string
}
export type UserEmailAndConfirmationCode = {
  email: string
  confirmationCode: string
  createdAt: string
}
export type UserEmailAndRecoveryCode = {
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
export type DevicesSchemaModel =  {
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
export type BlackListIPType = {
  ip: string
  countTimes: {
    createdAt: Date
  }[]
}
export type RefreshTokenJWTInBlackList = {
  refreshToken: string
  addedAt: string
}
export type BlackListIPDBType = {
  ip: string
  countTimes: {
    createdAt: string
  }[]
}

//...............................................likeStatus
export type likeStatusCommentIdType = {
  commentId: string
  userId: string
  likeStatus: string
  createdAt: string
}
export type likeStatusPostsIdType =  {
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
export type SessionType = {
  userId: string
  ip: string | null
  title: string | undefined
  lastActiveDate: string
  expirationDate: string
  deviceId: string
}
//...............................................JWT Payload
export type PayloadType = {
  userId: string
  deviceId: string
  iat: number
  exp: number
}