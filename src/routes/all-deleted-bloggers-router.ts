import {Request, Response, Router} from "express";
import {
  allDeletedBloggersPostsRepository
} from "../repositories/all-deleted-bloggers-db-repository";


export const allDeletedBloggersRouts = Router({})

allDeletedBloggersRouts.get('/',
  async (req: Request, res: Response) => {
    const foundBloggersPosts = await allDeletedBloggersPostsRepository.findBloggersPosts();
    if (foundBloggersPosts) {
      res.send(foundBloggersPosts)
    }else {
      res.status(404)
    }
  })