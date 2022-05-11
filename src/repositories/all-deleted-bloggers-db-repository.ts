import {deletedBloggersPostsCollection} from "./db";
import {AllDeletedPosts} from "../types/all_types";


export const allDeletedBloggersPostsRepository = {
  async findBloggersPosts(): Promise<AllDeletedPosts[]> {
    return deletedBloggersPostsCollection.find({}).toArray()
  }
}