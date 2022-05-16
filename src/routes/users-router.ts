import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bodyLogin,
  bodyPassword,
  checkoutMongoDbId,
  inputValidatorMiddleware, userIdParamsValidation
} from "../middlewares/input-validator-middleware";
import {authMiddlewareHeadersAuthorization} from "../middlewares/auth-middleware";


export const usersRouter = Router({});

usersRouter.get('/',
  ioc.usersController.getUsers.bind(ioc.usersController))

  .get('/:mongoId', checkoutMongoDbId,
    ioc.usersController.getUserByMongoDbId.bind(ioc.usersController))

  .post('/', authMiddlewareHeadersAuthorization,
    bodyLogin, bodyPassword, inputValidatorMiddleware,
    ioc.usersController.createNewUser.bind(ioc.usersController))

  .delete('/:userId', authMiddlewareHeadersAuthorization,
    userIdParamsValidation, inputValidatorMiddleware,
    ioc.usersController.deleteUserById.bind(ioc.usersController))


// .post('/', bodyLogin, bodyEmail, bodyPassword, inputValidatorMiddleware,
// ioc.usersController.createNewUser.bind(ioc.usersController))

