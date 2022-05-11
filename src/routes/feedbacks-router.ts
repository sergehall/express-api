import {Router, Response, Request} from "express";
import {ObjectId} from "mongodb";
import {ioc} from "../IoCContainer";


export const feedbacksRouter = Router({})

feedbacksRouter.get('/', async (req: Request, res: Response) => {
  const allFeedbacks = await ioc.feedbacksService.allFeedbacks()
  res.send(allFeedbacks)
})
  .post('/:userId',
    async (req: Request, res: Response) => {
      const userId = new ObjectId(req.params.userId)
      const newProduct = await ioc.feedbacksService.sendFeedback(req.body.comment, userId)
      res.status(201).send(newProduct.allFeedbacks)
    })
