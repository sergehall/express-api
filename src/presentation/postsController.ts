import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {ioc} from "../IoCContainer";

export class PostsController {
  constructor(private postsService: PostsService) {
  }

  async getAllPosts(req: Request, res: Response) {

    const parseQueryData = await ioc.parseQuery.parse(req)
    const pageNumber: number = parseQueryData.pageNumber
    const pageSize: number = parseQueryData.pageSize
    const title: string | null = parseQueryData.title

    const foundPosts = await this.postsService.findPosts(pageNumber, pageSize, title);
    res.send(foundPosts)
  }

  async createNewPost(req: Request, res: Response) {
    try {
      const title: string = req.body.title;
      const shortDescription: string = req.body.shortDescription;
      const content: string = req.body.content;
      const blogId: string = req.body.blogId
      const createdAt = (new Date()).toISOString()

      const newPost = await this.postsService.createPost(title, shortDescription, content, blogId, createdAt)

      if (newPost.resultCode === 0) {
        res.status(201)
        res.send({
          id: newPost.data.id,
          title: newPost.data.title,
          shortDescription: newPost.data.shortDescription,
          content: newPost.data.content,
          blogId: newPost.data.blogId,
          blogName: newPost.data.bloggerName,
          createdAt: newPost.data.createdAt
        })
      } else {
        res.status(400)
        const errorsMessages = newPost.errorsMessages
        const resultCode = newPost.resultCode
        res.send({errorsMessages, resultCode})
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async createNewCommentByPostId(req: Request, res: Response) {
    try {
      const postId: string = req.params.postId;
      const content: string = req.body.content;
      const  user  = req.user

      if (user === null) {
        res.status(401)
        res.send()
        return
      }
      const newPost = await this.postsService.createNewCommentByPostId(postId, content, user)


      if (newPost.resultCode === 0) {
        res.status(201)
        res.send(newPost.data)
        return
      }
      if (newPost.errorsMessages.find(f => f.field === "postId")) {
        res.status(404)
        res.send()
        return
      }
      res.status(400)
      const errorsMessages = newPost.errorsMessages
      const resultCode = newPost.resultCode
      res.send({errorsMessages, resultCode})
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const getPost = await this.postsService.getPostById(postId);
      if (getPost) {
        res.send(getPost)
      } else {
        res.status(404).send()
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async getCommentsByPostId(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const parseQueryData = await ioc.parseQuery.parse(req)
      const pageNumber = parseQueryData.pageNumber
      const pageSize = parseQueryData.pageSize

      const getPost = await this.postsService.getCommentsByPostId(postId, pageNumber, pageSize);
      if (getPost.pageSize === 0) {
        return res.status(404).send()

      }
      return res.send(getPost)


    } catch (error) {
      return res.sendStatus(500)
    }
  }


  async updatePostById(req: Request, res: Response) {
    try {
      const id: string = req.params.postId;
      const title: string = req.body.title
      const shortDescription: string = req.body.shortDescription
      const content: string = req.body.content
      const bloggerId: string = req.body.bloggerId

      const updatedPost = await this.postsService.updatePostById(id, title, shortDescription, content, bloggerId)
      if (updatedPost.resultCode === 0) {
        res.status(204)
        res.send()
        return
      }
      if (updatedPost.errorsMessages.find(p => p.field === "postId")) {
        res.status(404)
        res.send()
        return
      }
      res.status(400)
      const errorsMessages = updatedPost.errorsMessages
      const resultCode = updatedPost.resultCode
      return res.send({errorsMessages, resultCode})

    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  async deletePostById(req: Request, res: Response) {
    const id = req.params.postId

    const deletedPost = await this.postsService.deletedById(id)

    if (deletedPost) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }

  async deleteAllPosts(req: Request, res: Response) {

    const deletedPost = await this.postsService.deletedAllPosts()

    if (deletedPost) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }
}