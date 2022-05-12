import {client} from "./db-connection";
import {
  AllDeletedPosts,
  BloggerType,
  FeedbackDBType,
  PostsType,
  UserDBType
} from "../types/all_types";

// start mongod local
// ./mongod --dbpath ./data/db



const db = client.db("users")
export const bloggersCollection = db.collection<BloggerType>("bloggers")
export const postsCollection = db.collection<PostsType>("posts")
export const usersCollection = db.collection<UserDBType>("users")
export const feedbacksCollection = db.collection<FeedbackDBType>("feedbacks")
export const deletedBloggersPostsCollection = db.collection<AllDeletedPosts>("deletedBloggersPosts")
