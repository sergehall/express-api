import {Router} from "express";
import {
  idParamsValidation,
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidatorMiddleware,
} from "../middlewares/input-validator-middleware";
import {myContainer} from "../types/container";
import {UsersController} from "../presentation/userController";
import {AuthMiddlewares} from "../middlewares/authMiddlewares";



export const usersRouter = Router({});

const usersController = myContainer.resolve<UsersController>(UsersController)
const authMiddlewares = myContainer.resolve<AuthMiddlewares>(AuthMiddlewares)

usersRouter
  .get('/', usersController.getUsers.bind(usersController))

  .post('/',
    authMiddlewares.basicAuthorization,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidatorMiddleware,
    usersController.createNewUser.bind(usersController))

  .delete('/:userId',
    authMiddlewares.basicAuthorization,
    idParamsValidation,
    inputValidatorMiddleware,
    usersController.deleteUserById.bind(usersController))


