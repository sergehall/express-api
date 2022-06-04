import {BloggersRepository} from "./repositories/bloggers-db-repository";
import {BloggersService} from "./domain/bloggers-service";
import {PostsRepository} from "./repositories/posts-db-repository";
import {PostsService} from "./domain/posts-service";
import {FeedbacksRepository} from "./repositories/feedback-db-repository";
import {FeedbacksService} from "./domain/feedbacks-service";
import {PostsController} from "./presentation/postsController";
import {BloggersController} from "./presentation/bloggersCotroller";
import {FeedbacksController} from "./presentation/feedbacksController";
import {UsersRepository} from "./repositories/users-db-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./presentation/usersController";
import {AllDeletedBloggersPostsRepository} from "./repositories/all-deleted-bloggers-db-repository";
import {AllDelBloggersService} from "./domain/all-del-bloggers-service";
import {AllDelBloggersController} from "./presentation/all-dell-bloggersController";
import {CommentsService} from "./domain/comments-service";
import {CommentsRepository} from "./repositories/comments-db-repository";
import {CommentsController} from "./presentation/commentsController";
import {UsersAccountRepository} from "./repositories/usersAccount-db-repository";
import {AuthUsersAccountService} from "./domain/auth-usersAccount-service";


const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository)
const postsController = new PostsController(postsService)

const bloggersRepository = new BloggersRepository()
const bloggersService = new BloggersService(bloggersRepository)
const bloggersController = new BloggersController(bloggersService, postsService)

const usersRepository = new UsersRepository()
const usersService = new UsersService(usersRepository)
const usersController = new UsersController(usersService)

const feedbacksRepository = new FeedbacksRepository()
const feedbacksService = new FeedbacksService(feedbacksRepository)
const feedbacksController = new FeedbacksController(feedbacksService)

const allDeletedBloggersPostsRepository = new AllDeletedBloggersPostsRepository()
const allDelBloggersService = new AllDelBloggersService(allDeletedBloggersPostsRepository)
const allDelBloggersController = new AllDelBloggersController(allDelBloggersService)

const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository)
const commentsController = new CommentsController(commentsService)

const usersAccountRepository = new UsersAccountRepository()
const authUsersAccountService = new AuthUsersAccountService(usersAccountRepository)


export const ioc = {
  bloggersService: bloggersService,
  bloggersController: bloggersController,
  postsService: postsService,
  postsController: postsController,
  feedbacksService: feedbacksService,
  feedbacksController: feedbacksController,
  usersService: usersService,
  usersController: usersController,
  allDelBloggersService: allDelBloggersService,
  allDelBloggersController: allDelBloggersController,
  commentsService: commentsService,
  commentsController: commentsController,
  authUsersAccountService: authUsersAccountService
}