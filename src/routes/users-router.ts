import {Router} from "express";
import {
  idParamsValidation,
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidatorMiddleware,
} from "../middlewares/input-validator-middleware";
import {container} from "../Container";
import {UsersController} from "../presentation/userController";
import {AuthMiddlewares} from "../middlewares/auth";



export const usersRouter = Router({});

const usersController = container.resolve<UsersController>(UsersController)
const authMiddlewares = container.resolve<AuthMiddlewares>(AuthMiddlewares)

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


