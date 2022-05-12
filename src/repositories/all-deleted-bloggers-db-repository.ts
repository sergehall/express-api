import {deletedBloggersPostsCollection} from "./db";
import {AllDeletedPosts} from "../types/all_types";


export class AllDeletedBloggersPostsRepository {
  async findBloggersPosts(): Promise<AllDeletedPosts[]> {
    return deletedBloggersPostsCollection.find({}).toArray()
  }
}