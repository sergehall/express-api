import {Router, Request, Response} from "express"
import {MyModelEmailsToSent} from "../mongoose/EmailsToSentSchemaModel";
import {MyModelBlackListIP} from "../mongoose/BlackListIPSchemaModel";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import {MyModelBloggers} from "../mongoose/BloggersSchemaModel";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModelUserAccount} from "../mongoose/UsersAccountsSchemaModel";
import {MyModelUser} from "../mongoose/UsersSchemaModel";
import {MyModelBlogPosts} from "../mongoose/PostsBlogSchemaModel";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {MyModelThreeLastLikesPost} from "../mongoose/ThreeLastLikesPost";
import {MyModelLikeStatusCommentId} from "../mongoose/likeStatusComment";
import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";


export const testingRouter = Router({})


testingRouter
  .delete("/all-data", async (req: Request, res: Response) => {
    await MyModelUserAccount.deleteMany({})
    await MyModelUser.deleteMany({})
    await MyModelBloggers.deleteMany({})
    await MyModelPosts.deleteMany({})
    await MyModelLikeStatusPostsId.deleteMany({})
    await MyModelDevicesSchema.deleteMany({})
    await MyModelLikeStatusCommentId.deleteMany({})
    await MyModelThreeLastLikesPost.deleteMany({})
    await MyModelEmailsToSent.deleteMany({})
    await MyModelBlackListIP.deleteMany({})
    await MyModeLast10secRegConf.deleteMany({})
    await MyModeLast10secReg.deleteMany({})
    await MyModeLast10secLog.deleteMany({})
    await MyModeLast10secRedEmailRes.deleteMany({})
    await MyModelComments.deleteMany({})
    await MyModelBlackListRefreshTokenJWT.deleteMany({})
    await MyModelBlogPosts.deleteMany({})
    await MyModelBlogs.deleteMany({})
    res.status(204).send()
    return
  })
