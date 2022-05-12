import {AllDelBloggersService} from "../domain/all-del-bloggers-service";
import {Request, Response} from "express";


export class AllDelBloggersController {
  constructor(private allDelBloggersService: AllDelBloggersService) {
  }
  async getAllDeletedBloggers(req: Request, res: Response) {
    const foundBloggersPosts = await this.allDelBloggersService.getAllDelBloggers()
    if (foundBloggersPosts) {
      res.send(foundBloggersPosts)
    }else {
      res.status(404).send({})
    }
  }
}