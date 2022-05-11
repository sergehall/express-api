export type ErrorType = {
  message: string
  field: string
}
export type ArrayErrorsType = Array<ErrorType>
export type BloggerType = {
  id: number
  name: string
  youtubeUrl: string
}
export type ArrayBloggersType = Array<BloggerType>
export type ReturnTypeObjectBlogers = {
  data: BloggerType,
  errorsMessages: Array<ErrorType>,
  resultCode: number
}
export type PostsType = {
  id: number
  title: string
  shortDescription: string
  content: string
  bloggerId: number
  bloggerName: string
}
export type ReturnTypeObjectPosts = {
  data: PostsType,
  errorsMessages: Array<ErrorType>,
  resultCode: number
}
export type BloggerIdAndArrayPosts = [bloggerIdKey: number, posts: Array<PostsType>]
export type AllDeletedPosts = Array<BloggerIdAndArrayPosts>
export type UserDBType = {
  _id: object,
  userName: string
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