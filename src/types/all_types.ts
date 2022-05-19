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
export type UserDBType = {
  _id: object,
  id: string
  login: string
  email: string,
  passwordHash: string,
  passwordSalt: string,
  createdAt: Date
}
export type FeedbackDBType = {
  _id: object,
  allFeedbacks: Array<{
    commentId: object,
    comment: string
  }>
}

export type Pagination = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: object
}
