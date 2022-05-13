import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {PostsService} from "../domain/posts-service";
import {parseQuery} from "../middlewares/pagination";




export class BloggersController {
  constructor(private bloggersService: BloggersService, private postsService: PostsService ) {
  }
  async getAllBloggers(req: Request, res: Response) {
    const parseData = await parseQuery(req)

    const foundBloggers = await this.bloggersService.findBloggers(parseData.pageNumber,parseData.pageSize, parseData.searchNameTerm)

    res.send(foundBloggers)
  }

  async getAllPostByBloggerId(req: Request, res: Response) {
    const id = +req.params.bloggerId;
    const parseData = await parseQuery(req)

    const foundBlogger =  await this.bloggersService.getBloggerById(id);

    if (foundBlogger) {

      const foundPosts = await this.postsService.findPostsByBloggerId(id.toString(), parseData.pageNumber,parseData.pageSize, parseData.searchNameTerm);

      res.send(foundPosts)
    } else {
      res.status(404)
      res.send()
    }
  }

  async createPostByBloggerId(req: Request, res: Response) {
    const id = +req.params.bloggerId;
    const title: string = req.body.title
    const shortDescription: string = req.body.shortDescription
    const content: string = req.body.content

    const foundBlogger =  await this.bloggersService.getBloggerById(id);
    if (foundBlogger) {
      const bloggerId = foundBlogger.id
      const createPosts = await this.postsService.createPost(title, shortDescription, content, bloggerId)
      const creatBloggerBack = {
        id: createPosts.data.id,
        title: createPosts.data.title,
        shortDescription: createPosts.data.shortDescription,
        content: createPosts.data.content,
        bloggerId: createPosts.data.bloggerId,
        bloggerName: createPosts.data.bloggerName
      }
      res.status(201)
      res.send(creatBloggerBack)
    } else {
      res.status(404)
      res.send()
    }
  }

  async createNewBlogger(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const youtubeUrl = req.body.youtubeUrl
      const createNewBlogger = await this.bloggersService.createNewBlogger(name, youtubeUrl)

      if (createNewBlogger.resultCode === 0) {
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

  async deleteAllBloggers(req: Request, res: Response) {
    const deletedBlogger = await this.bloggersService.deletedAllBloggers();

    if (deletedBlogger) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }
}