import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";




export class BloggersController {
  constructor(private bloggersService: BloggersService ) {
  }
  async getAllBloggers(req: Request, res: Response) {
    const foundBloggers = await this.bloggersService.findBloggers(req.query.youtubeUrl?.toString())
    // @ts-ignore
    foundBloggers.map(i => delete i._id)
    res.send(foundBloggers)
  }

  async createNewBlogger(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const youtubeUrl = req.body.youtubeUrl
      const createNewBlogger = await this.bloggersService.createNewBlogger(name, youtubeUrl)

      if (createNewBlogger.resultCode == 0) {
        // @ts-ignore
        delete createNewBlogger.data._id
        res.status(201)
        res.send(createNewBlogger.data)
      } else {
        const errorsMessages = createNewBlogger.errorsMessages
        const resultCode = createNewBlogger.resultCode
        res.status(400)
        res.send({errorsMessages, resultCode})
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async getBloggerById(req: Request, res: Response) {
    try {
      const id = +req.params.bloggerId;
      const getBlogger = await this.bloggersService.getBloggerById(id);
      if (getBlogger) {
        const blogger = {
          id: getBlogger.id,
          name: getBlogger.name,
          youtubeUrl: getBlogger.youtubeUrl
        }
        res.send(blogger)
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async updateBloggerById(req: Request, res: Response) {
    try {
      const id = +req.params.bloggerId;
      const name = req.body.name;
      const youtubeUrl = req.body.youtubeUrl

      const updatedBlogger = await this.bloggersService.updateBloggerById(id, name, youtubeUrl)

      if (updatedBlogger.resultCode === 0) {
        res.status(204)
        res.send()
      } else {
        if (updatedBlogger.errorsMessages.find(f => f.field === "bloggerId")) {
          res.status(404)
          res.send()
        } else {
          const errorsMessages = updatedBlogger.errorsMessages
          const resultCode = updatedBlogger.resultCode
          res.status(400)
          res.send({errorsMessages, resultCode})
        }
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async deleteBloggerById(req: Request, res: Response) {
    const id = +req.params.bloggerId
    const deletedBlogger = await this.bloggersService.deletedBloggerById(id);

    if (deletedBlogger) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }
}