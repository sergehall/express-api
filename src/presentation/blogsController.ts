import {BlogsService} from "../domain/blogs-service";
import {Request, Response} from "express";
import {ioc} from "../IoCContainer";


export class BlogsController {
  constructor(private blogsService: BlogsService) {
  }

  async getAllBlogs(req: Request, res: Response) {

    const parseQueryData = await ioc.parseQuery.parse(req)
    const pageNumber: number = parseQueryData.pageNumber
    const pageSize: number = parseQueryData.pageSize
    const title: string | null = parseQueryData.title
    const sortBy: string | null = parseQueryData.sortBy
    const sortDirection: string | null = parseQueryData.sortDirection


    const foundBlogs = await this.blogsService.findBlogs(pageNumber, pageSize, title, sortBy, sortDirection);
    res.send(foundBlogs)
  }

  async createNewBlog(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const youtubeUrl = req.body.youtubeUrl

      const newBlog = await this.blogsService.createBlog(name, youtubeUrl);
      if (newBlog.resultCode === 0) {
        res.status(201)
        res.send({
            id: newBlog.data.id,
            name: newBlog.data.name,
            youtubeUrl: newBlog.data.youtubeUrl,
            createdAt: newBlog.data.createdAt
          }
        )
      }

    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async createNewPostByBlogId(req: Request, res: Response) {
    const title: string = req.body.title;
    const shortDescription: string = req.body.shortDescription;
    const content: string = req.body.content
    const blogId: string = req.params.blogId

    const newBlogPost = await this.blogsService.createNewPostByBlogId(title, shortDescription, content, blogId)
    if (newBlogPost.errorsMessages.length !== 0) {
      res.status(404)
      return res.send()
    }
    if (newBlogPost.data !== null) {
      res.status(201)
      return res.send({
        id: newBlogPost.data.id,
        title: newBlogPost.data.title,
        shortDescription: newBlogPost.data.shortDescription,
        content: newBlogPost.data.content,
        blogId: newBlogPost.data.blogId,
        blogName: newBlogPost.data.blogName,
        createdAt: newBlogPost.data.createdAt
      })
    }
  }
}



