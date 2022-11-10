import {AllDeletedPosts} from "../types/types";
import {MyModelAllDeletedPosts} from "../mongoose/AllDeletedPostsSchemaModel";


export class AllDeletedBloggersPostsRepository {
  async findBloggersPosts(): Promise<AllDeletedPosts> {
    return await MyModelAllDeletedPosts.find({})
  }
}