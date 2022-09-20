import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  blogIdParamsValidation,
  contentBlogValidation,
  inputValidatorMiddleware,
  nameBlogValidation, shortDescriptionBlogValidation, titleBlogValidation,
  youtubeUrlBlogValidation
} from "../middlewares/input-validator-middleware";



export const blogsRouts = Router({})

blogsRouts.get('/',
  ioc.blogsController.getAllBlogs.bind(ioc.blogsController))

  .post('/',
    ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    nameBlogValidation,
    youtubeUrlBlogValidation,
    inputValidatorMiddleware,
    ioc.blogsController.createNewBlog.bind(ioc.blogsController))

  .post('/:blogId/posts',
    ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    titleBlogValidation,
    shortDescriptionBlogValidation,
    contentBlogValidation,
    blogIdParamsValidation,
    inputValidatorMiddleware,
    ioc.blogsController.createNewPostByBlogId.bind(ioc.blogsController))