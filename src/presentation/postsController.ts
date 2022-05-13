import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";


export class PostsController {
  constructor(private postsService: PostsService) {
  }

  async getAllPosts(req: Request, res: Response) {
    const foundPosts = await this.postsService.findPosts(req.query.title?.toString());
    // @ts-ignore
    foundPosts.map(i => delete i._id)
    res.send(foundPosts)
  }

  async createNewPost(req: Request, res: Response) {
    try {
      const title: string = req.body.title;
      const shortDescription: string = req.body.shortDescription;
      const content: string = req.body.content;
      const bloggerId: number = +req.body.bloggerId

      const newPost = await this.postsService.createPost(title, shortDescription, content, bloggerId)

      if (newPost.resultCode === 0) {
        const postReturn = {
          id: newPost.data.id,
          title: newPost.data.title,
          shortDescription: newPost.data.shortDescription,
          content: newPost.data.content,
          bloggerId: newPost.data.bloggerId,
          bloggerName: newPost.data.bloggerName
        }
        res.status(201)
        res.send(postReturn)
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

  async getPostById(req: Request, res: Response) {
    try {
      const postId = +req.params.postId;
      const getPost = await this.postsService.getPostById(postId);
      if (getPost) {
        const postReturn = {
          id: getPost.id,
          title: getPost.title,
          shortDescription: getPost.shortDescription,
          content: getPost.content,
          bloggerId: getPost.bloggerId,
          bloggerName: getPost.bloggerName
        }
        res.send(postReturn)
      } else {
        res.status(404).send()
      }
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  async updatePostById(req: Request, res: Response) {
    try {
      const id: number = +req.params.postId;
      const title: string = req.body.title
      const shortDescription: string = req.body.shortDescription
      const content: string = req.body.content
      const bloggerId: number = +req.body.bloggerId

      const updatedPost = await this.postsService.updatePostById(id, title, shortDescription, content, bloggerId)
      if (updatedPost.resultCode === 0) {
        res.status(204)
        res.send()
      } else if (updatedPost.errorsMessages.find(p => p.field === "postId")) {
        res.status(404)
        res.send()
      } else {
        console.log(updatedPost)
        res.status(400)
        const errorsMessages = updatedPost.errorsMessages
        const resultCode = updatedPost.resultCode
        res.send({errorsMessages, resultCode})
      }
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  async deletePostById(req: Request, res: Response) {
    const id = +req.params.postId

    const deletedPost = await this.postsService.deletedById(id)

    if (deletedPost) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }

  async deletePosts(req: Request, res: Response) {

    const deletedPost = await this.postsService.deletedAllPosts()

    if (deletedPost) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }
}