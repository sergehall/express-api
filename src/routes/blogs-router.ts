import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  blogIdParamsValidation,
  contentBlogValidation, idParamsValidation,
  inputValidatorMiddleware,
  nameBlogValidation, shortDescriptionBlogValidation, titleBlogValidation,
  youtubeUrlBlogValidation
} from "../middlewares/input-validator-middleware";


export const blogsRouts = Router({})

blogsRouts.get('/',
  ioc.blogsController.getAllBlogs.bind(ioc.blogsController))

  .get('/:blogId/posts',
    blogIdParamsValidation,
    inputValidatorMiddleware,
    ioc.auth.noneStatusAccessToken,
    ioc.blogsController.findAllPostsByBlogId.bind(ioc.blogsController))

  .get('/:id',
    idParamsValidation,
    inputValidatorMiddleware,
    ioc.blogsController.findBlogById.bind(ioc.blogsController))

  .post('/',
    ioc.auth.basicAuthorization,
    nameBlogValidation,
    youtubeUrlBlogValidation,
    inputValidatorMiddleware,
    ioc.blogsController.createNewBlog.bind(ioc.blogsController))

  .post('/:blogId/posts',
    ioc.auth.basicAuthorization,
    titleBlogValidation,
    shortDescriptionBlogValidation,
    contentBlogValidation,
    blogIdParamsValidation,
    inputValidatorMiddleware,
    ioc.blogsController.createNewPostByBlogId.bind(ioc.blogsController))

  .put('/:id',
    ioc.auth.basicAuthorization,
    nameBlogValidation,
    youtubeUrlBlogValidation,
    idParamsValidation,
    inputValidatorMiddleware,
    ioc.blogsController.updatedBlogById.bind(ioc.blogsController))

  .delete('/:id',
    ioc.auth.basicAuthorization,
    idParamsValidation,
    inputValidatorMiddleware,
    ioc.blogsController.deleteBlogById.bind(ioc.blogsController))

