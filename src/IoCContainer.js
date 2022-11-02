"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioc = void 0;
const bloggers_db_repository_1 = require("./repositories/bloggers-db-repository");
const bloggers_service_1 = require("./domain/bloggers-service");
const posts_db_repository_1 = require("./repositories/posts-db-repository");
const posts_service_1 = require("./domain/posts-service");
const feedback_db_repository_1 = require("./repositories/feedback-db-repository");
const feedbacks_service_1 = require("./domain/feedbacks-service");
const postsController_1 = require("./presentation/postsController");
const bloggersCotroller_1 = require("./presentation/bloggersCotroller");
const feedbacksController_1 = require("./presentation/feedbacksController");
const all_deleted_bloggers_db_repository_1 = require("./repositories/all-deleted-bloggers-db-repository");
const all_del_bloggers_service_1 = require("./domain/all-del-bloggers-service");
const all_dell_bloggersController_1 = require("./presentation/all-dell-bloggersController");
const comments_service_1 = require("./domain/comments-service");
const comments_db_repository_1 = require("./repositories/comments-db-repository");
const commentsController_1 = require("./presentation/commentsController");
const usersAccount_db_repository_1 = require("./repositories/usersAccount-db-repository");
const usersAccount_service_1 = require("./domain/usersAccount-service");
const blackListIP_repository_1 = require("./repositories/blackListIP-repository");
const emailsToSent_db_repository_1 = require("./repositories/emailsToSent-db-repository");
const usersIPlast10sec_bd_repository_1 = require("./repositories/usersIPlast10sec-bd-repository");
const blackListRefreshTokenJWT_db_repository_1 = require("./repositories/blackListRefreshTokenJWT-db-repository");
const auth_1 = require("./middlewares/auth");
const checkHowManyTimesUserLoginLast10secWithSameIp_1 = require("./middlewares/checkHowManyTimesUserLoginLast10secWithSameIp");
const parse_query_1 = require("./middlewares/parse-query");
const blogs_db_repository_1 = require("./repositories/blogs-db-repository");
const blogsController_1 = require("./presentation/blogsController");
const blogs_service_1 = require("./domain/blogs-service");
const preparation_posts_1 = require("./repositories/preparation-posts");
const preparation_comments_1 = require("./repositories/preparation-comments");
const userAccountsController_1 = require("./presentation/userAccountsController");
const users_db_repository_1 = require("./repositories/users-db-repository");
const users_service_1 = require("./domain/users-service");
const usersController_1 = require("./presentation/usersController");
const securityDevices_db_repository_1 = require("./repositories/securityDevices-db-repository");
const securityDeviceController_1 = require("./presentation/securityDeviceController");
const securityDevices_service_1 = require("./domain/securityDevices-service");
const jwt_service_1 = require("./application/jwt-service");
const emailSender_1 = require("./demons/emailSender");
const email_adapter_1 = require("./adapters/email-adapter");
const clearing_usersIPLast10secRepository_1 = require("./demons/clearing-usersIPLast10secRepository");
const clearing_expJWT_1 = require("./demons/clearing-expJWT");
// usersAccount
const usersAccountRepository = new usersAccount_db_repository_1.UsersAccountRepository();
const usersAccountService = new usersAccount_service_1.UsersAccountService(usersAccountRepository);
const usersAccountController = new userAccountsController_1.UsersAccountController(usersAccountService);
// auth
const auth = new auth_1.Auth();
// middleware
const checkHowManyTimesUserLoginLast10sec = new checkHowManyTimesUserLoginLast10secWithSameIp_1.CheckHowManyTimesUserLoginLast10sec();
const parseQuery = new parse_query_1.ParseQuery();
// posts
const postsRepository = new posts_db_repository_1.PostsRepository();
const postsService = new posts_service_1.PostsService(postsRepository);
const postsController = new postsController_1.PostsController(postsService);
// bloggers
const bloggersRepository = new bloggers_db_repository_1.BloggersRepository();
const bloggersService = new bloggers_service_1.BloggersService(bloggersRepository);
const bloggersController = new bloggersCotroller_1.BloggersController(bloggersService, postsService);
// users
const usersRepository = new users_db_repository_1.UsersRepository();
const usersService = new users_service_1.UsersService(usersRepository);
const usersController = new usersController_1.UsersController(usersService);
// feedbacks
const feedbacksRepository = new feedback_db_repository_1.FeedbacksRepository();
const feedbacksService = new feedbacks_service_1.FeedbacksService(feedbacksRepository);
const feedbacksController = new feedbacksController_1.FeedbacksController(feedbacksService);
// allDeletedBloggers
const allDeletedBloggersPostsRepository = new all_deleted_bloggers_db_repository_1.AllDeletedBloggersPostsRepository();
const allDelBloggersService = new all_del_bloggers_service_1.AllDelBloggersService(allDeletedBloggersPostsRepository);
const allDelBloggersController = new all_dell_bloggersController_1.AllDelBloggersController(allDelBloggersService);
// comments
const commentsRepository = new comments_db_repository_1.CommentsRepository();
const commentsService = new comments_service_1.CommentsService(commentsRepository);
const commentsController = new commentsController_1.CommentsController(commentsService);
// Repositories
const blackListIPRepository = new blackListIP_repository_1.BlackListIPRepository();
const emailsToSentRepository = new emailsToSent_db_repository_1.EmailsToSentRepository();
const usersIPLast10secRepositories = new usersIPlast10sec_bd_repository_1.UsersIPLast10secRepositories();
const blackListRefreshTokenJWTRepository = new blackListRefreshTokenJWT_db_repository_1.BlackListRefreshTokenJWTRepository();
// Blogs
const blogsRepository = new blogs_db_repository_1.BlogsRepository();
const blogsService = new blogs_service_1.BlogsService(blogsRepository);
const blogsController = new blogsController_1.BlogsController(blogsService);
// PostsExtLikesInfo
const preparationPostsForReturn = new preparation_posts_1.PreparationPosts();
// CommentsExtLikesInfo
const preparationComments = new preparation_comments_1.PreparationComments();
// SecurityDevices
const securityDevicesRepository = new securityDevices_db_repository_1.SecurityDevicesRepository();
const securityDevicesService = new securityDevices_service_1.SecurityDevicesService(securityDevicesRepository);
const securityDevicesController = new securityDeviceController_1.SecurityDevicesController(securityDevicesService);
// JWT Service
const jwtService = new jwt_service_1.JWTService();
// email adapter
const emailAdapter = new email_adapter_1.EmailAdapter();
// my demons
const emailSender = new emailSender_1.EmailSender();
const clearingIpWithDateOlder11Sec = new clearing_usersIPLast10secRepository_1.ClearingIpWithDateOlder11Sec();
const clearingExpDateJWT = new clearing_expJWT_1.ClearingExpDateJWT();
exports.ioc = {
    auth: auth,
    bloggersService: bloggersService,
    bloggersController: bloggersController,
    postsService: postsService,
    postsController: postsController,
    feedbacksService: feedbacksService,
    feedbacksController: feedbacksController,
    usersService: usersService,
    usersController: usersController,
    commentsService: commentsService,
    commentsController: commentsController,
    allDelBloggersService: allDelBloggersService,
    allDelBloggersController: allDelBloggersController,
    blogsService: blogsService,
    blogsController: blogsController,
    usersAccountService: usersAccountService,
    preparationPostsForReturn: preparationPostsForReturn,
    blackListIPRepository: blackListIPRepository,
    emailsToSentRepository: emailsToSentRepository,
    usersIPLast10secRepositories: usersIPLast10secRepositories,
    usersAccountController: usersAccountController,
    blackListRefreshTokenJWTRepository: blackListRefreshTokenJWTRepository,
    checkHowManyTimesUserLoginLast10sec: checkHowManyTimesUserLoginLast10sec,
    preparationComments: preparationComments,
    parseQuery: parseQuery,
    securityDevicesService: securityDevicesService,
    securityDevicesController: securityDevicesController,
    jwtService: jwtService,
    emailSender: emailSender,
    emailAdapter: emailAdapter,
    clearingIpWithDateOlder11Sec: clearingIpWithDateOlder11Sec,
    clearingExpDateJWT: clearingExpDateJWT
};
//# sourceMappingURL=IoCContainer.js.map