import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {PostsService} from "../domain/posts-service";
import {parseQuery} from "../middlewares/parse-query";


export class BloggersController {
  constructor(private bloggersService: BloggersService,
              private postsService: PostsService) {
    this.bloggersService = bloggersService
    this.postsService = postsService
  }

  async getAllBloggers(req: Request, res: Response) {

    const parseQueryData = parseQuery(req)
    const pageNumber = parseQueryData.pageNumber
    const pageSize = parseQueryData.pageSize
    const searchNameTerm = parseQueryData.searchNameTerm

    const foundBloggers = await this.bloggersService.findBloggers(pageNumber, pageSize, searchNameTerm)

    res.send(foundBloggers)
  }

  async getAllPostByBloggerId(req: Request, res: Response) {
    const id: string = req.params.bloggerId;
    const foundBlogger = await this.bloggersService.getBloggerById(id);
    if (foundBlogger.errorsMessages.length === 0) {
      const parseQueryData = parseQuery(req)
      const pageNumber: number = parseQueryData.pageNumber
      const pageSize: number = parseQueryData.pageSize

      const foundPosts = await this.postsService.findPostsByBloggerId(id, pageNumber, pageSize);
      res.send(foundPosts)
    } else {
      res.status(404)
      res.send()
    }
  }

  async createPostByBloggerId(req: Request, res: Response) {
    try {
      const bloggerId: string = req.params.bloggerId;
      const title: string = req.body.title
      const shortDescription: string = req.body.shortDescription
      const content: string = req.body.content

      const createPosts = await this.postsService.createPost(title, shortDescription, content, bloggerId)

      if (createPosts.errorsMessages.length === 0) {
        res.status(201)
        res.send({
          id: createPosts.data.id,
          title: createPosts.data.title,
          shortDescription: createPosts.data.shortDescription,
          content: createPosts.data.content,
          bloggerId: createPosts.data.bloggerId,
          bloggerName: createPosts.data.bloggerName
        })
      }
      res.status(404)
      res.send()

    } catch (e) {
      console.log(e)
      res.status(500)
    }
  }

  async createNewBlogger(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const youtubeUrl = req.body.youtubeUrl
      const createNewBlogger = await this.bloggersService.createNewBlogger(name, youtubeUrl)

      if (createNewBlogger.resultCode === 0) {
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
      const id = req.params.bloggerId;
      const getBlogger = await this.bloggersService.getBloggerById(id);
      if (getBlogger.data.id !== null) {
        res.send(getBlogger.data)
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async updateBloggerById(req: Request, res: Response) {
    try {
      const id = req.params.bloggerId;
      const name = req.body.name;
      const youtubeUrl = req.body.youtubeUrl

      const updatedBlogger = await this.bloggersService.updateBloggerById(id, name, youtubeUrl)

      if (updatedBlogger.resultCode === 0) {
        res.status(204)
        res.send()
        return
      }
      if (updatedBlogger.errorsMessages.find(f => f.field === "bloggerId")) {
        res.status(404)
        res.send()
        return
      }
      const errorsMessages = updatedBlogger.errorsMessages
      const resultCode = updatedBlogger.resultCode
      res.status(400)
      res.send({errorsMessages, resultCode})

    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async deleteBloggerById(req: Request, res: Response) {
    const id = req.params.bloggerId
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