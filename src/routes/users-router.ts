import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  inputValidatorMiddleware,
  userIdParamsValidation, loginValidation, passwordValidation, emailValidation
} from "../middlewares/input-validator-middleware";


export const usersRouter = Router({});

usersRouter.get('/',
  ioc.usersAccountController.getUsers.bind(ioc.usersAccountController))

  .post('/', ioc.auth.basicAuthorization,
    loginValidation, passwordValidation, emailValidation, inputValidatorMiddleware,
    ioc.usersAccountController.createNewUser.bind(ioc.usersAccountController))

  .delete('/:userId', ioc.auth.basicAuthorization,
    userIdParamsValidation, inputValidatorMiddleware,
    ioc.usersAccountController.deleteUserById.bind(ioc.usersAccountController))


