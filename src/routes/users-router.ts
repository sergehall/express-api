import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bodyLogin,
  bodyPassword,
  bodyEmail,
  inputValidatorMiddleware,
  userIdParamsValidation
} from "../middlewares/input-validator-middleware";


export const usersRouter = Router({});

usersRouter.get('/',
  ioc.usersAccountController.getUsers.bind(ioc.usersAccountController))

  .post('/', ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    bodyLogin, bodyPassword, bodyEmail, inputValidatorMiddleware,
    ioc.usersAccountController.createNewUser.bind(ioc.usersAccountController))

  .delete('/:userId', ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    userIdParamsValidation, inputValidatorMiddleware,
    ioc.usersAccountController.deleteUserById.bind(ioc.usersAccountController))


