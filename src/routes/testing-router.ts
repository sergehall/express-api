import {Router, Request, Response} from "express"
import {
  blackListIPCollection, blackListRefreshTokenJWTCollection,
  bloggersCollection,
  commentsCollection,
  emailsToSentUsersAccountCollection,
  postsCollection,
  usersAccountCollection,
  usersCollection,
  usersIPLast10secCollectionLog,
  usersIPLast10secCollectionReg,
  usersIPLast10secCollectionRegConf,
  usersIPLast10secCollectionRegEmailRes,
} from "../repositories/db";



export const testingRouter = Router({})


testingRouter
  .delete("/all-data", async (req: Request, res: Response) => {
    await emailsToSentUsersAccountCollection.deleteMany({})
    await blackListIPCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await usersAccountCollection.deleteMany({})
    await usersIPLast10secCollectionRegConf.deleteMany({})
    await usersIPLast10secCollectionReg.deleteMany({})
    await usersIPLast10secCollectionLog.deleteMany({})
    await usersIPLast10secCollectionRegEmailRes.deleteMany({})
    await bloggersCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await blackListRefreshTokenJWTCollection.deleteMany({})
    res.status(204).send()
    return
  })
