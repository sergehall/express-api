import {PostsRepository} from "./repositories/posts-db-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./presentation/postsController";
import {FeedbacksRepository} from "./repositories/feedback-db-repository";
import {FeedbacksService} from "./domain/feedbacks-service";
import {FeedbacksController} from "./presentation/feedbacksController";
import {CommentsService} from "./domain/comments-service";
import {CommentsRepository} from "./repositories/comments-db-repository";
import {CommentsController} from "./presentation/commentsController";
import {BlogsRepository} from "./repositories/blogs-db-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./presentation/blogsController";
import {
  SecurityDevicesRepository
} from "./repositories/securityDevices-db-repository";
import {SecurityDevicesService} from "./domain/securityDevices-service";
import {SecurityDevicesController} from "./presentation/deviceController";
import {BlackListIPRepository} from "./repositories/blackListIP-repository";
import {
  BlackListRefreshTokenJWTRepository
} from "./repositories/blackListRefreshTokenJWT-db-repository";
import {Auth} from "./middlewares/auth";
import {ParseQuery} from "./middlewares/parse-query";
import {PreparationPosts} from "./repositories/preparation-posts";
import {PreparationComments} from "./repositories/preparation-comments";
import {JWTService} from "./application/jwt-service";
import {ClearingInvalidJWTFromBlackList} from "./demons/clearingInvalidJWTFromBlackList";
import {ClearingDevicesWithExpDate} from "./demons/clearingDevicesWithExpDate";
import {ClearingIpWithCreatedAtOlder10Sec} from "./demons/clearingIpWithCreatedAtOlder10Sec";
import {ValidateLast10secReq} from "./middlewares/validateLast10secReq";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./presentation/userController";
import {UsersRepository} from "./repositories/users-db-repository";
import {UsersIPLast10secRepositories} from "./repositories/usersIPlast10sec-db-repository";
import {EmailsRepository} from "./repositories/emails-db-repository";
import {EmailsSender} from "./demons/emailSender";
import {EmailsAdapter} from "./adapters/email-adapter";

// Users
const usersRepository = new UsersRepository()
const usersService = new UsersService(usersRepository)
const usersController = new UsersController(usersService)
// Middleware
const auth = new Auth()
const parseQuery = new ParseQuery()
const validateLast10secReq = new ValidateLast10secReq()
// Posts
const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository)
const postsController = new PostsController(postsService)
// Feedbacks
const feedbacksRepository = new FeedbacksRepository()
const feedbacksService = new FeedbacksService(feedbacksRepository)
const feedbacksController = new FeedbacksController(feedbacksService)
// Comments
const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository)
const commentsController = new CommentsController(commentsService)
// Blogs
const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)
const blogsController = new BlogsController(blogsService, postsService)
// PostsExtLikesInfo
const preparationPostsForReturn = new PreparationPosts()
// CommentsExtLikesInfo
const preparationComments = new PreparationComments()
// Devices
const securityDevicesRepository = new SecurityDevicesRepository()
const securityDevicesService = new SecurityDevicesService(securityDevicesRepository)
const securityDevicesController = new SecurityDevicesController(securityDevicesService)
// JWT Service
const jwtService = new JWTService()
// Email
const emailsAdapter = new EmailsAdapter()
const emailsRepository = new EmailsRepository()
// My demons
const emailsSender = new EmailsSender()
const clearingIpWithCreatedAtOlder10Sec = new ClearingIpWithCreatedAtOlder10Sec()
const clearingInvalidJWTFromBlackList = new ClearingInvalidJWTFromBlackList()
const clearingDevicesWithExpDate = new ClearingDevicesWithExpDate()
// Last10sec
const usersIPLast10secRepositories = new UsersIPLast10secRepositories()
// Black list
const blackListIPRepository = new BlackListIPRepository()
const blackListRefreshTokenJWTRepository = new BlackListRefreshTokenJWTRepository()


export const ioc = {
  auth: auth,
  usersService: usersService,
  usersController: usersController,
  postsService: postsService,
  postsController: postsController,
  feedbacksService: feedbacksService,
  feedbacksController: feedbacksController,
  commentsService: commentsService,
  commentsController: commentsController,
  blogsService: blogsService,
  blogsController: blogsController,
  preparationPostsForReturn: preparationPostsForReturn,
  blackListIPRepository: blackListIPRepository,
  emailsRepository: emailsRepository,
  usersIPLast10secRepositories: usersIPLast10secRepositories,
  blackListRefreshTokenJWTRepository: blackListRefreshTokenJWTRepository,
  validateLast10secReq: validateLast10secReq,
  preparationComments: preparationComments,
  parseQuery: parseQuery,
  securityDevicesService: securityDevicesService,
  securityDevicesController: securityDevicesController,
  jwtService: jwtService,
  emailsSender: emailsSender,
  emailsAdapter: emailsAdapter,
  clearingIpWithCreatedAtOlder10Sec: clearingIpWithCreatedAtOlder10Sec,
  clearingInvalidJWTFromBlackList: clearingInvalidJWTFromBlackList,
  clearingDevicesWithExpDate: clearingDevicesWithExpDate
}