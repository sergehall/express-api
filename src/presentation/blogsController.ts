import {BlogsService} from "../domain/blogs-service";
import {Request, Response} from "express";
import {ioc} from "../IoCContainer";
import {PostsService} from "../domain/posts-service";


export class BlogsController {
  constructor(private blogsService: BlogsService, private postService: PostsService) {
  }

  async getAllBlogs(req: Request, res: Response) {

    const parseQueryData = await ioc.parseQuery.parse(req)
    const pageNumber: number = parseQueryData.pageNumber
    const pageSize: number = parseQueryData.pageSize
    const title: string | null = parseQueryData.title
    const sortBy: string | null = parseQueryData.sortBy
    const sortDirection: string | null = parseQueryData.sortDirection


    const foundBlogs = await this.blogsService.findBlogs(pageNumber, pageSize, title, sortBy, sortDirection);
    return res.send(foundBlogs)
  }

  async createNewBlog(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const youtubeUrl = req.body.youtubeUrl

      const newBlog = await this.blogsService.createBlog(name, youtubeUrl);
      if (newBlog.data !== null && newBlog.resultCode === 0) {
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

    const newPost = await this.postService.createPost(title, shortDescription, content, blogId)

    if (!newPost.data) {
      return res.status(404).send(newPost.errorsMessages)
    }
    return  res.status(201).send(newPost.data)
  }

  async getAllPostsByBlog(req: Request, res: Response) {
    const blogId: string = req.params.blogId

    const parseQueryData = await ioc.parseQuery.parse(req)
    const pageNumber: number = parseQueryData.pageNumber
    const pageSize: number = parseQueryData.pageSize
    const sortBy: string | null = parseQueryData.sortBy
    const sortDirection: string | null = parseQueryData.sortDirection

    const allPostsByBlog = await this.blogsService.getAllPostsByBlog(pageNumber, pageSize, sortBy, sortDirection, blogId)
    if (allPostsByBlog === null) {
      return res.sendStatus(404)
    }
    return res.send(allPostsByBlog)
  }

  async findBlogById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const getBlog = await this.blogsService.findBlogById(id);
      if (getBlog) {
        res.send(getBlog)
      } else {
        res.status(404).send()
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async updatedBlogById(req: Request, res: Response) {
    try {
      const name: string = req.body.name;
      const youtubeUrl: string = req.body.youtubeUrl
      const id: string = req.params.id

      const updatedBlog = await this.blogsService.updatedBlogById(name, youtubeUrl, id);

      if (updatedBlog.resultCode === 0) {
        res.status(204)
        return res.send()
      }

      if (updatedBlog.errorsMessages.find(p => p.field === "blogId")) {
        res.status(404)
        return res.send()
      }

      res.status(400)
      const errorsMessages = updatedBlog.errorsMessages
      const resultCode = updatedBlog.resultCode
      return res.send({errorsMessages, resultCode})

    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }

  }

  async deleteBlogById(req: Request, res: Response) {
    const id = req.params.id

    const deletedBlog = await this.blogsService.deletedBlogById(id)
    if (deletedBlog) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }
}



