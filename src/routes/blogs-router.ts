import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  blogIdParamsValidation, contentValidation,
  idParamsValidation,
  inputValidatorMiddleware,
  nameValidation,
  shortDescriptionValidation,
  titleValidation, urlValidation
} from "../middlewares/input-validator-middleware";
import {container} from "../Container";
import {BlogsController} from "../presentation/blogsController";


export const blogsRouts = Router({})

const blogsController = container.resolve<BlogsController>(BlogsController)

blogsRouts.get('/',
  blogsController.getAllBlogs.bind(blogsController))

  .get('/:blogId/posts',
    blogIdParamsValidation,
    inputValidatorMiddleware,
    ioc.auth.noneStatusAccessToken,
    blogsController.findAllPostsByBlogId.bind(blogsController))

  .get('/:id',
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.findBlogById.bind(blogsController))

  .post('/',
    ioc.auth.basicAuthorization,
    nameValidation,
    urlValidation,
    inputValidatorMiddleware,
    blogsController.createNewBlog.bind(blogsController))

  .post('/:blogId/posts',
    ioc.auth.basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdParamsValidation,
    inputValidatorMiddleware,
    blogsController.createNewPostByBlogId.bind(blogsController))

  .put('/:id',
    ioc.auth.basicAuthorization,
    nameValidation,
    urlValidation,
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.updatedBlogById.bind(blogsController))

  .delete('/:id',
    ioc.auth.basicAuthorization,
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.deleteBlogById.bind(blogsController))

