import {Router, Request, Response} from "express"
import {
  blackListIPCollection,
  usersAccountCollection,
  usersIPLast10secCollection
} from "../repositories/db";



export const testingRouter = Router({})


testingRouter
  .delete("/all-data", async (req: Request, res: Response) => {
    await usersAccountCollection.deleteMany({})
    await usersIPLast10secCollection.deleteMany({})
    await blackListIPCollection.deleteMany({})
    res.send()
  })
