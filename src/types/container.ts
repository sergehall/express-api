import {Container} from "inversify";
import {TYPES} from "./types";
import {UsersService} from "../domain/users-service";
import {UsersController} from "../presentation/userController";
import {PostsController} from "../presentation/postsController";
import {PostsRepository} from "../repositories/posts-db-repository";
import {UsersRepository} from "../repositories/users-db-repository";
import {BlogsController} from "../presentation/blogsController";
import {BlogsService} from "../domain/blogs-service";
import {BlogsRepository} from "../repositories/blogs-db-repository";
import {PostsService} from "../domain/posts-service";
import {FeedbacksRepository} from "../repositories/feedback-db-repository";
import {FeedbacksService} from "../domain/feedbacks-service";
import {FeedbacksController} from "../presentation/feedbacksController";
import {CommentsRepository} from "../repositories/comments-db-repository";
import {CommentsService} from "../domain/comments-service";
import {CommentsController} from "../presentation/commentsController";
import {SecurityDevicesController} from "../presentation/deviceController";
import {SecurityDevicesService} from "../domain/securityDevices-service";
import {SecurityDevicesRepository} from "../repositories/securityDevices-db-repository";
import {EmailManagers} from "../managers/email-managers";
import {EmailsAdapter} from "../adapters/email-adapter";
import {BusinessService} from "../domain/business-service";
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
import {AuthMiddlewares} from "../middlewares/authMiddlewares";
import {PreparationComments} from "../repositories/preparation-comments";
import {PreparationPosts} from "../repositories/preparation-posts";
import {EmailsRepository} from "../repositories/emails-db-repository";
import {JWTService} from "../application/jwt-service";
import {ParseQuery} from "../middlewares/parse-query";
import {LikeStatusPostsRepository} from "../repositories/LikeStatusPosts-db-repository";
import {
  LikeStatusCommentsRepository
} from "../repositories/likeStatusComment-db-repository";


export const myContainer = new Container();

// JWT
myContainer.bind<JWTService>(TYPES.JWTService).to(JWTService)
// Users
myContainer.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository);
myContainer.bind<UsersService>(TYPES.UsersService).to(UsersService);
myContainer.bind<UsersController>(TYPES.UsersController).to(UsersController);
// Posts
myContainer.bind<PostsRepository>(TYPES.PostsRepository).to(PostsRepository);
myContainer.bind<PostsService>(TYPES.PostsService).to(PostsService);
myContainer.bind<PostsController>(TYPES.PostsController).to(PostsController);
// Blogs
myContainer.bind<BlogsRepository>(TYPES.BlogsRepository).to(BlogsRepository);
myContainer.bind<BlogsService>(TYPES.BlogsService).to(BlogsService);
myContainer.bind<BlogsController>(TYPES.BlogsController).to(BlogsController);
// Feedbacks
myContainer.bind<FeedbacksRepository>(TYPES.FeedbacksRepository).to(FeedbacksRepository);
myContainer.bind<FeedbacksService>(TYPES.FeedbacksService).to(FeedbacksService);
myContainer.bind<FeedbacksController>(TYPES.FeedbacksController).to(FeedbacksController);
// Comments
myContainer.bind<CommentsRepository>(TYPES.CommentsRepository).to(CommentsRepository);
myContainer.bind<CommentsService>(TYPES.CommentsService).to(CommentsService);
myContainer.bind<CommentsController>(TYPES.CommentsController).to(CommentsController);
// SecurityDevices
myContainer.bind<SecurityDevicesRepository>(TYPES.SecurityDevicesRepository).to(SecurityDevicesRepository);
myContainer.bind<SecurityDevicesService>(TYPES.SecurityDevicesService).to(SecurityDevicesService);
myContainer.bind<SecurityDevicesController>(TYPES.SecurityDevicesController).to(SecurityDevicesController);
// Emails
myContainer.bind<EmailManagers>(TYPES.EmailManagers).to(EmailManagers);
myContainer.bind<EmailsAdapter>(TYPES.EmailsAdapter).to(EmailsAdapter);
myContainer.bind<BusinessService>(TYPES.BusinessService).to(BusinessService);
myContainer.bind<EmailsRepository>(TYPES.EmailsRepository).to(EmailsRepository)
// Black List
myContainer.bind<BlackListRefreshTokenJWTRepository>(TYPES.BlackListRefreshTokenJWTRepository).to(BlackListRefreshTokenJWTRepository);
myContainer.bind<BlackListIPRepository>(TYPES.BlackListIPRepository).to(BlackListIPRepository);
// Demons
myContainer.bind<EmailsSender>(TYPES.EmailsSender).to(EmailsSender);
myContainer.bind<ClearingDevicesWithExpDate>(TYPES.ClearingDevicesWithExpDate).to(ClearingDevicesWithExpDate);
myContainer.bind<ClearingInvalidJWTFromBlackList>(TYPES.ClearingInvalidJWTFromBlackList).to(ClearingInvalidJWTFromBlackList);
myContainer.bind<ClearingIpWithCreatedAtOlder10Sec>(TYPES.ClearingIpWithCreatedAtOlder10Sec).to(ClearingIpWithCreatedAtOlder10Sec);
// Last 10 sec
myContainer.bind<UsersIPLast10secRepositories>(TYPES.UsersIPLast10secRepositories).to(UsersIPLast10secRepositories);
// Validate last 10 sec
myContainer.bind<ValidateLast10secReq>(TYPES.ValidateLast10secReq).to(ValidateLast10secReq);
// Auth
myContainer.bind<AuthMiddlewares>(TYPES.AuthMiddlewares).to(AuthMiddlewares);
// Preparation
myContainer.bind<PreparationPosts>(TYPES.PreparationPosts).to(PreparationPosts);
myContainer.bind<PreparationComments>(TYPES.PreparationComments).to(PreparationComments);
// ParseQuery
myContainer.bind<ParseQuery>(TYPES.ParseQuery).to(ParseQuery);
// LikeStatusPostsRepository
myContainer.bind<LikeStatusPostsRepository>(TYPES.LikeStatusPostsRepository).to(LikeStatusPostsRepository);
// LikeStatusCommentRepository
myContainer.bind<LikeStatusCommentsRepository>(TYPES.LikeStatusCommentsRepository).to(LikeStatusCommentsRepository);
