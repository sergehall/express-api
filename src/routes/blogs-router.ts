import {Router} from "express";
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
import {Auth} from "../middlewares/auth";


export const blogsRouts = Router({})

const blogsController = container.resolve<BlogsController>(BlogsController)
const auth = container.resolve<Auth>(Auth)

blogsRouts.get('/',
  blogsController.getAllBlogs.bind(blogsController))

  .get('/:blogId/posts',
    blogIdParamsValidation,
    inputValidatorMiddleware,
    auth.noneStatusAccessToken,
    blogsController.findAllPostsByBlogId.bind(blogsController))

  .get('/:id',
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.findBlogById.bind(blogsController))

  .post('/',
    auth.basicAuthorization,
    nameValidation,
    urlValidation,
    inputValidatorMiddleware,
    blogsController.createNewBlog.bind(blogsController))

  .post('/:blogId/posts',
    auth.basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdParamsValidation,
    inputValidatorMiddleware,
    blogsController.createNewPostByBlogId.bind(blogsController))

  .put('/:id',
    auth.basicAuthorization,
    nameValidation,
    urlValidation,
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.updatedBlogById.bind(blogsController))

  .delete('/:id',
    auth.basicAuthorization,
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.deleteBlogById.bind(blogsController))

