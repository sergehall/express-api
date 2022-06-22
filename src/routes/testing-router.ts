import {Router, Request, Response} from "express"
import {
  blackListIPCollection,
  bloggersCollection, commentsCollection,
  emailsToSentUsersAccountCollection,
  postsCollection,
  usersAccountCollection,
  usersCollection,
  usersIPLast10secCollection
} from "../repositories/db";



export const testingRouter = Router({})


testingRouter
  .delete("/all-data", async (req: Request, res: Response) => {
    await blackListIPCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await usersAccountCollection.deleteMany({})
    await usersIPLast10secCollection.deleteMany({})
    await bloggersCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await emailsToSentUsersAccountCollection.deleteMany({})
    res.status(204).send()
    return
  })
