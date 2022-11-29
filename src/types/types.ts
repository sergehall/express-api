import {UsersController} from "../presentation/userController";
import {PostsController} from "../presentation/postsController";
import {PostsRepository} from "../repositories/posts-db-repository";
import {UsersRepository} from "../repositories/users-db-repository";
import {BlogsService} from "../domain/blogs-service";
import {BlogsController} from "../presentation/blogsController";
import {BlogsRepository} from "../repositories/blogs-db-repository";
import {PostsService} from "../domain/posts-service";
import {FeedbacksService} from "../domain/feedbacks-service";
import {CommentsController} from "../presentation/commentsController";
import {CommentsService} from "../domain/comments-service";
import {CommentsRepository} from "../repositories/comments-db-repository";
import {SecurityDevicesRepository} from "../repositories/securityDevices-db-repository";
import {SecurityDevicesService} from "../domain/securityDevices-service";
import {SecurityDevicesController} from "../presentation/deviceController";
import {EmailsAdapter} from "../adapters/email-adapter";
import {EmailManagers} from "../managers/email-managers";
import {BusinessService} from "../domain/business-service";
import {JWTService} from "../application/jwt-service";
import {
  BlackListRefreshTokenJWTRepository
} from "../repositories/blackListRefreshTokenJWT-db-repository";
import {EmailsSender} from "../demons/emailSender";
import {ClearingDevicesWithExpDate} from "../demons/clearingDevicesWithExpDate";
import {ClearingInvalidJWTFromBlackList} from "../demons/clearingInvalidJWTFromBlackList";
import {ClearingIpWithCreatedAtOlder10Sec} from "../demons/clearingIpWithCreatedAtOlder10Sec";
import {BlackListIPRepository} from "../repositories/blackListIP-repository";
import {UsersIPLast10secRepositories} from "../repositories/usersIPlast10sec-db-repository";
import {ValidateLast10secReq} from "../middlewares/validateLast10secReq";
import {PreparationComments} from "../repositories/preparation-comments";
import {PreparationPosts} from "../repositories/preparation-posts";
import {EmailsRepository} from "../repositories/emails-db-repository";
import {ParseQuery} from "../middlewares/parse-query";
import {LikeStatusPostsRepository} from "../repositories/likeStatusPosts-db-repository";


export const TYPES = {
  // Users
  UsersRepository: Symbol.for("UsersRepository"),
  UsersService: Symbol.for("UsersService"),
  UsersController: Symbol.for("UsersController"),
  // Posts
  PostsRepository: Symbol.for("PostsRepository"),
  PostsService: Symbol.for("PostsService"),
  PostsController: Symbol.for("PostsController"),
  // Blogs
  BlogsRepository: Symbol.for("BlogsRepository"),
  BlogsService: Symbol.for("BlogsService"),
  BlogsController: Symbol.for("BlogsController"),
  // Feedbacks
  FeedbacksRepository: Symbol.for("FeedbacksRepository"),
  FeedbacksService: Symbol.for("FeedbacksService"),
  FeedbacksController: Symbol.for("FeedbacksController"),
  // Comments
  CommentsRepository: Symbol.for("CommentsRepository"),
  CommentsService: Symbol.for("CommentsService"),
  CommentsController: Symbol.for("CommentsController"),
  // SecurityDevices
  SecurityDevicesRepository: Symbol.for("SecurityDevicesRepository"),
  SecurityDevicesService: Symbol.for("SecurityDevicesService"),
  SecurityDevicesController: Symbol.for("SecurityDevicesController"),
  // Emails
  EmailManagers: Symbol.for("EmailManagers"),
  EmailsAdapter: Symbol.for("EmailsAdapter"),
  BusinessService: Symbol.for("BusinessService"),
  EmailsRepository: Symbol.for("EmailsRepository"),
  // BlackList
  BlackListRefreshTokenJWTRepository: Symbol.for("BlackListRefreshTokenJWTRepository"),
  BlackListIPRepository: Symbol.for("BlackListIPRepository"),
  // Demons
  EmailsSender: Symbol.for("EmailsSender"),
  ClearingDevicesWithExpDate: Symbol.for("ClearingDevicesWithExpDate"),
  ClearingInvalidJWTFromBlackList: Symbol.for("ClearingInvalidJWTFromBlackList"),
  ClearingIpWithCreatedAtOlder10Sec: Symbol.for("ClearingIpWithCreatedAtOlder10Sec"),
  // Last 10 sec
  UsersIPLast10secRepositories: Symbol.for("UsersIPLast10secRepositories"),
  // Validate last 10 sec
  ValidateLast10secReq: Symbol.for("ValidateLast10secReq"),
  // AuthMiddlewares
  AuthMiddlewares: Symbol.for("AuthMiddlewares"),
  // PreparationPosts
  PreparationPosts: Symbol.for("PreparationPosts"),
  PreparationComments: Symbol.for("PreparationComments"),
  // JWT
  JWTService: Symbol.for("JWTService"),
  // ParseQuery
  ParseQuery: Symbol.for("ParseQuery"),
  // LikeStatus
  LikeStatusPostsRepository: Symbol.for("LikeStatusPostsRepository"),
  LikeStatusCommentsRepository: Symbol.for("  LikeStatusCommentsRepository"),
};
