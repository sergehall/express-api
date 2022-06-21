import {Router, Request, Response} from "express"
import {
  blackListIPCollection,
  usersAccountCollection, usersCollection,
  usersIPLast10secCollection
} from "../repositories/db";



export const testingRouter = Router({})


testingRouter
  .delete("/all-data", async (req: Request, res: Response) => {
    await blackListIPCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await usersAccountCollection.deleteMany({})
    await usersIPLast10secCollection.deleteMany({})
    res.status(204).send()
    return
  })
