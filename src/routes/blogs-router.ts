import {Router} from "express";
import {
  blogIdParamsValidation, contentValidation,
  idParamsValidation,
  inputValidatorMiddleware,
  nameValidation,
  shortDescriptionValidation,
  titleValidation, urlValidation
} from "../middlewares/input-validator-middleware";
import {myContainer} from "../types/container";
import {BlogsController} from "../presentation/blogsController";
import {AuthMiddlewares} from "../middlewares/authMiddlewares";


export const blogsRouts = Router({})

const blogsController = myContainer.resolve<BlogsController>(BlogsController)
const authMiddlewares = myContainer.resolve<AuthMiddlewares>(AuthMiddlewares)

blogsRouts.get('/',
  blogsController.getAllBlogs.bind(blogsController))

  .get('/:blogId/posts',
    blogIdParamsValidation,
    inputValidatorMiddleware,
    authMiddlewares.findBlogById,
    authMiddlewares.noneStatusAccessToken,
    blogsController.findAllPostsByBlogId.bind(blogsController))

  .get('/:id',
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.findBlogById.bind(blogsController))

  .post('/',
    authMiddlewares.basicAuthorization,
    nameValidation,
    urlValidation,
    inputValidatorMiddleware,
    blogsController.createNewBlog.bind(blogsController))

  .post('/:blogId/posts',
    authMiddlewares.basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdParamsValidation,
    inputValidatorMiddleware,
    blogsController.createNewPostByBlogId.bind(blogsController))

  .put('/:id',
    authMiddlewares.basicAuthorization,
    nameValidation,
    urlValidation,
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.updatedBlogById.bind(blogsController))

  .delete('/:id',
    authMiddlewares.basicAuthorization,
    idParamsValidation,
    inputValidatorMiddleware,
    blogsController.deleteBlogById.bind(blogsController))

