import {client} from "./db-connection";
import {
  AllDeletedPosts, BlackListIPDBType,
  BloggerType,
  CommentsDBType,
  FeedbackDBType,
  PostsType, UserAccountDBType,
  UserDBType
} from "../types/all_types";


const db = client.db("users")
export const bloggersCollection = db.collection<BloggerType>("bloggers")
export const postsCollection = db.collection<PostsType>("posts")
export const usersCollection = db.collection<UserDBType>("users")
export const usersAccountCollection = db.collection<UserAccountDBType>("usersAccount")
export const feedbacksCollection = db.collection<FeedbackDBType>("feedbacks")
export const commentsCollection = db.collection<CommentsDBType>("comments")
export const blackListIPCollection = db.collection<BlackListIPDBType>("blackListIP")
export const deletedBloggersPostsCollection = db.collection<AllDeletedPosts>("deletedBloggersPosts")
