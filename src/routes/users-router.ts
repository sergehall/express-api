import {Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bodyEmail,
  bodyLogin,
  bodyPassword,
  checkoutMongoDbId,
  inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";


export const usersRouter = Router({});


usersRouter.post('/', bodyLogin, bodyEmail, bodyPassword, inputValidatorMiddleware,
  ioc.usersController.createNewUser.bind(ioc.usersController))

  .get('/:mongoId', checkoutMongoDbId,
    ioc.usersController.getUserByMongoDbId.bind(ioc.usersController))