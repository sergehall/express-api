import {BloggersRepository} from "./repositories/bloggers-db-repository";
import {BloggersService} from "./domain/bloggers-service";
import {PostsRepository} from "./repositories/posts-db-repository";
import {PostsService} from "./domain/posts-service";
import {FeedbacksRepository} from "./repositories/feedback-db-repository";
import {FeedbacksService} from "./domain/feedbacks-service";
import {UserRepository} from "./repositories/users-db-repository";
import {UserService} from "./domain/user-service";


const bloggersRepository = new BloggersRepository()
const bloggersService = new BloggersService(bloggersRepository)

const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository)

const userRepository = new UserRepository()
const userService = new UserService(userRepository)

const feedbacksRepository = new FeedbacksRepository()
const feedbacksService = new FeedbacksService(feedbacksRepository)



export const ioc = {
  bloggersService: bloggersService,
  postsService: postsService,
  feedbacksService: feedbacksService,
  userService: userService

}