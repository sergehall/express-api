import {Router, Request, Response} from "express"
import {MyModelBlackListIP} from "../mongoose/BlackListIPSchemaModel";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModelBlogPosts} from "../mongoose/PostsBlogSchemaModel";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
import {MyModelThreeLastLikesPost} from "../mongoose/ThreeLastLikesPost";
import {MyModelLikeStatusCommentId} from "../mongoose/likeStatusComment";
import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {MyModelUser} from "../mongoose/UsersSchemaModel";
import {MyModelEmailsConfirmCode} from "../mongoose/EmailsConfirmCodeSchemaModel";

export const testingRouter = Router({})

testingRouter
  .delete("/all-data", async (req: Request, res: Response) => {
    // delete all Collections
    await MyModelUser.deleteMany({})
    await MyModelBlogs.deleteMany({})
    await MyModelPosts.deleteMany({})
    await MyModelBlogPosts.deleteMany({})
    await MyModelLikeStatusPostsId.deleteMany({})
    await MyModelDevicesSchema.deleteMany({})
    await MyModelLikeStatusCommentId.deleteMany({})
    await MyModelThreeLastLikesPost.deleteMany({})
    await MyModelEmailsConfirmCode.deleteMany({})
    await MyModelBlackListIP.deleteMany({})
    await MyModeLast10secRegConf.deleteMany({})
    await MyModeLast10secReg.deleteMany({})
    await MyModeLast10secLog.deleteMany({})
    await MyModeLast10secRedEmailRes.deleteMany({})
    await MyModelComments.deleteMany({})
    await MyModelBlackListRefreshTokenJWT.deleteMany({})
    return res.status(204).send()
  })
