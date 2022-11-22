import {Router, Request, Response} from "express"
import {MyModelBlackListIP} from "../mongoose/BlackListIPSchemaModel";
import {MyModelComments} from "../mongoose/CommentsSchemaModel";
import {MyModelPosts} from "../mongoose/PostsSchemaModel";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import {MyModelLikeStatusPostsId} from "../mongoose/likeStatusPosts";
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
    await MyModelDevicesSchema.deleteMany({})
    await MyModelLikeStatusPostsId.deleteMany({})
    await MyModelLikeStatusCommentId.deleteMany({})
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
