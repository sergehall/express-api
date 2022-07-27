import {AllDeletedPosts} from "../types/all_types";
import {MyModelAllDeletedPosts} from "../mongoose/AllDeletedPostsSchemaModel";


export class AllDeletedBloggersPostsRepository {
  async findBloggersPosts(): Promise<AllDeletedPosts[]> {
    return MyModelAllDeletedPosts.find({}).lean()
  }
}