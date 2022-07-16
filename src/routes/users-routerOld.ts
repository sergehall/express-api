import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bodyLogin,
  bodyPassword,
  checkoutMongoDbId,
  inputValidatorMiddleware, userIdParamsValidation
} from "../middlewares/input-validator-middleware";
import {authMiddlewareBasicAuthorization} from "../middlewares/auth-Basic-User-authorization";


export const usersRouterOld = Router({});

usersRouterOld.get('/',
  ioc.usersController.getUsers.bind(ioc.usersController))

  .get('/:mongoId', checkoutMongoDbId,
    ioc.usersController.getUserByMongoDbId.bind(ioc.usersController))

  .post('/', authMiddlewareBasicAuthorization,
    bodyLogin, bodyPassword, inputValidatorMiddleware,
    ioc.usersController.createNewUser.bind(ioc.usersController))

  .delete('/:userId', authMiddlewareBasicAuthorization,
    userIdParamsValidation, inputValidatorMiddleware,
    ioc.usersController.deleteUserById.bind(ioc.usersController))


