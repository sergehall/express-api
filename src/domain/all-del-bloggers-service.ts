import {
  AllDeletedBloggersPostsRepository
} from "../repositories/all-deleted-bloggers-db-repository";


export class AllDelBloggersService {
  constructor(private allDeletedBloggersPostsRepository: AllDeletedBloggersPostsRepository) {
    this.allDeletedBloggersPostsRepository = allDeletedBloggersPostsRepository
  }
  async getAllDelBloggers(){
    return await this.allDeletedBloggersPostsRepository.findBloggersPosts()
  }
}