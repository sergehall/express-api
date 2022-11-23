import {Container} from "inversify";
import {TYPES} from "./types";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./presentation/userController";
import {PostsController} from "./presentation/postsController";
import {PostsRepository} from "./repositories/posts-db-repository";
import {UsersRepository} from "./repositories/users-db-repository";
import {BlogsController} from "./presentation/blogsController";
import {BlogsService} from "./domain/blogs-service";
import {BlogsRepository} from "./repositories/blogs-db-repository";
import {PostsService} from "./domain/posts-service";
import {FeedbacksRepository} from "./repositories/feedback-db-repository";
import {FeedbacksService} from "./domain/feedbacks-service";
import {FeedbacksController} from "./presentation/feedbacksController";
import {CommentsRepository} from "./repositories/comments-db-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./presentation/commentsController";
import {SecurityDevicesController} from "./presentation/deviceController";
import {SecurityDevicesService} from "./domain/securityDevices-service";
import {SecurityDevicesRepository} from "./repositories/securityDevices-db-repository";
import {EmailManagers} from "./managers/email-managers";
import {EmailsAdapter} from "./adapters/email-adapter";
import {BusinessService} from "./domain/business-service";
import {JWTService} from "./application/jwt-service";
import {
  BlackListRefreshTokenJWTRepository
} from "./repositories/blackListRefreshTokenJWT-db-repository";
import {EmailsSender} from "./demons/emailSender";
import {ClearingDevicesWithExpDate} from "./demons/clearingDevicesWithExpDate";
import {ClearingInvalidJWTFromBlackList} from "./demons/clearingInvalidJWTFromBlackList";
import {ClearingIpWithCreatedAtOlder10Sec} from "./demons/clearingIpWithCreatedAtOlder10Sec";
import {BlackListIPRepository} from "./repositories/blackListIP-repository";
import {UsersIPLast10secRepositories} from "./repositories/usersIPlast10sec-db-repository";
import {ValidateLast10secReq} from "./middlewares/validateLast10secReq";
import {Auth} from "./middlewares/auth";


export const container = new Container();

// Users
container.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository);
container.bind<UsersService>(TYPES.UsersService).to(UsersService);
container.bind<UsersController>(TYPES.UsersController).to(UsersController);
// Posts
container.bind<PostsRepository>(TYPES.PostsRepository).to(PostsRepository);
container.bind<PostsService>(TYPES.PostsService).to(PostsService);
container.bind<PostsController>(TYPES.PostsController).to(PostsController);
// Blogs
container.bind<BlogsRepository>(TYPES.BlogsRepository).to(BlogsRepository);
container.bind<BlogsService>(TYPES.BlogsService).to(BlogsService);
container.bind<BlogsController>(TYPES.BlogsController).to(BlogsController);
// Feedbacks
container.bind<FeedbacksRepository>(TYPES.FeedbacksRepository).to(FeedbacksRepository);
container.bind<FeedbacksService>(TYPES.FeedbacksService).to(FeedbacksService);
container.bind<FeedbacksController>(TYPES.FeedbacksController).to(FeedbacksController);
// Comments
container.bind<CommentsRepository>(TYPES.CommentsRepository).to(CommentsRepository);
container.bind<CommentsService>(TYPES.CommentsService).to(CommentsService);
container.bind<CommentsController>(TYPES.CommentsController).to(CommentsController);
// SecurityDevices
container.bind<SecurityDevicesRepository>(TYPES.SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind<SecurityDevicesService>(TYPES.SecurityDevicesService).to(SecurityDevicesService);
container.bind<SecurityDevicesController>(TYPES.SecurityDevicesController).to(SecurityDevicesController);
// Emails
container.bind<EmailManagers>(TYPES.EmailManagers).to(EmailManagers);
container.bind<EmailsAdapter>(TYPES.EmailsAdapter).to(EmailsAdapter);
container.bind<BusinessService>(TYPES.BusinessService).to(BusinessService);
// JWT
container.bind<JWTService>(TYPES.JWTService).to(JWTService);
// Black List
container.bind<BlackListRefreshTokenJWTRepository>(TYPES.BlackListRefreshTokenJWTRepository).to(BlackListRefreshTokenJWTRepository);
container.bind<BlackListIPRepository>(TYPES.BlackListIPRepository).to(BlackListIPRepository);
// Demons
container.bind<EmailsSender>(TYPES.EmailsSender).to(EmailsSender);
container.bind<ClearingDevicesWithExpDate>(TYPES.ClearingDevicesWithExpDate).to(ClearingDevicesWithExpDate);
container.bind<ClearingInvalidJWTFromBlackList>(TYPES.ClearingInvalidJWTFromBlackList).to(ClearingInvalidJWTFromBlackList);
container.bind<ClearingIpWithCreatedAtOlder10Sec>(TYPES.ClearingIpWithCreatedAtOlder10Sec).to(ClearingIpWithCreatedAtOlder10Sec);
// Last 10 sec
container.bind<UsersIPLast10secRepositories>(TYPES.UsersIPLast10secRepositories).to(UsersIPLast10secRepositories);
// Validate last 10 sec
container.bind<ValidateLast10secReq>(TYPES.ValidateLast10secReq).to(ValidateLast10secReq);
// Auth
container.bind<Auth>(TYPES.Auth).to(Auth);
