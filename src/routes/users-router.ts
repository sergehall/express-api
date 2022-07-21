import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bodyLogin,
  bodyPassword,
  inputValidatorMiddleware,
  userIdParamsValidation
} from "../middlewares/input-validator-middleware";


export const usersRouter = Router({});

usersRouter.get('/',
  ioc.usersController.getUsers.bind(ioc.usersController))

  .get('/:mongoId', ioc.checkoutMongoDbId.checkOut,
    ioc.usersController.getUserByMongoDbId.bind(ioc.usersController))

  .post('/', ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    bodyLogin, bodyPassword, inputValidatorMiddleware,
    ioc.usersController.createNewUser.bind(ioc.usersController))

  .delete('/:userId', ioc.authMiddlewareBasicAuthorization.authBasicCheck,
    userIdParamsValidation, inputValidatorMiddleware,
    ioc.usersController.deleteUserById.bind(ioc.usersController))


