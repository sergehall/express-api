import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {ioc} from "../IoCContainer";
import {UserType} from "../types/types";

export class PostsController {
  constructor(private postsService: PostsService) {
  }

  async getAllPosts(req: Request, res: Response) {

    const parseQueryData = await ioc.parseQuery.parse(req)
    const pageNumber: number = parseQueryData.pageNumber
    const pageSize: number = parseQueryData.pageSize
    const sortBy: string | null = parseQueryData.sortBy
    const sortDirection: string | null = parseQueryData.sortDirection
    const currentUser: UserType | null = req.user

    const foundPosts = await this.postsService.findPosts(pageNumber, pageSize, sortBy, sortDirection, currentUser);
    res.send(foundPosts)
  }

  async createNewPost(req: Request, res: Response) {
    try {
      const title: string = req.body.title;
      const shortDescription: string = req.body.shortDescription;
      const content: string = req.body.content;
      const blogId: string = req.body.blogId

      const newPost = await this.postsService.createPost(title, shortDescription, content, blogId)

      if (newPost.errorsMessages.length !== 0) {
        return res.status(400).send(newPost.errorsMessages)
      }
      return res.status(201).send(newPost.data)

    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async createNewCommentByPostId(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const content = req.body.content;
      const user: UserType | null = req.user

      if (!user) {
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
      const user: UserType | null = req.user
      const getPost = await this.postsService.getPostById(postId, user);
      if (!getPost) {
        res.status(404).send()
      } else {
        res.send(getPost)
        return
      }

    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  async getCommentsByPostId(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const parseQueryData = await ioc.parseQuery.parse(req)
      const pageNumber = parseQueryData.pageNumber
      const pageSize = parseQueryData.pageSize
      const sortBy: string | null = parseQueryData.sortBy
      const sortDirection: string | null = parseQueryData.sortDirection
      const user: UserType | null = req.user

      const getPost = await this.postsService.getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection, user);
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

  async likeStatusPostId(req: Request, res: Response) {
    const likeStatus = req.body.likeStatus
    const postId: string = req.params.postId;
    const user: UserType = req.user
    const likeStatusPost = await this.postsService.changeLikeStatusPost(user, postId, likeStatus);
    if (!likeStatusPost) {
      return res.sendStatus(404)
    }
    return res.sendStatus(204)
  }

}