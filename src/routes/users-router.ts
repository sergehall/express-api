import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  idParamsValidation,
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidatorMiddleware,
} from "../middlewares/input-validator-middleware";


export const usersRouter = Router({});

usersRouter
  .get('/', ioc.usersController.getUsers.bind(ioc.usersController))

  .post('/',
    ioc.auth.basicAuthorization,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidatorMiddleware,
    ioc.usersController.createNewUser.bind(ioc.usersController))

  .delete('/:userId',
    ioc.auth.basicAuthorization,
    idParamsValidation,
    inputValidatorMiddleware,
    ioc.usersController.deleteUserById.bind(ioc.usersController))


