import {BlogsService} from "../domain/blogs-service";
import {Request, Response} from "express";
import {ioc} from "../IoCContainer";
import {PostsService} from "../domain/posts-service";
import {UserType} from "../types/types";


export class BlogsController {
  constructor(protected blogsService: BlogsService, protected postService: PostsService) {
  }

  async getAllBlogs(req: Request, res: Response) {

    const parseQueryData = await ioc.parseQuery.parse(req)
    const pageNumber: number = parseQueryData.pageNumber
    const pageSize: number = parseQueryData.pageSize
    const sortBy: string | null = parseQueryData.sortBy
    const sortDirection: string | null = parseQueryData.sortDirection


    const foundBlogs = await this.blogsService.findBlogs(pageNumber, pageSize, sortBy, sortDirection);
    return res.send(foundBlogs)
  }

  async createNewBlog(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const websiteUrl = req.body.websiteUrl

      const newBlog = await this.blogsService.createBlog(name, websiteUrl);
      if (newBlog.data && newBlog.data.name) {
        res.status(201)
        res.send({
            id: newBlog.data.id,
            name: newBlog.data.name,
            websiteUrl: newBlog.data.websiteUrl,
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
    return res.status(201).send(newPost.data)
  }

  async findAllPostsByBlogId(req: Request, res: Response) {
    const blogId: string = req.params.blogId
    const currentUser: UserType | null = req.user
    const parseQueryData = await ioc.parseQuery.parse(req)
    const pageNumber: number = parseQueryData.pageNumber
    const pageSize: number = parseQueryData.pageSize
    const sortBy: string | null = parseQueryData.sortBy
    const sortDirection: string | null = parseQueryData.sortDirection

    const allPostsByBlog = await this.blogsService.findAllPostsByBlogId(pageNumber, pageSize, sortBy, sortDirection, blogId, currentUser)
    if (!allPostsByBlog) {
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
      const websiteUrl: string = req.body.websiteUrl
      const id: string = req.params.id

      const updatedBlog = await this.blogsService.updatedBlogById(name, websiteUrl, id);

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



