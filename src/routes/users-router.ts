import {Request, Response, Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bodyLogin,
  bodyPassword,
  inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";
import {authMiddlewareBasicAuthorization} from "../middlewares/auth-Basic-User-authorization";
import requestIp from "request-ip";

export const usersRouter = Router({});

usersRouter.post('/',
  bodyLogin, bodyPassword, inputValidatorMiddleware,
  authMiddlewareBasicAuthorization,
  async (req: Request, res: Response) => {
    const clientIp = requestIp.getClientIp(req);
    const user = await ioc.usersAccountService.createUser(req.body.login, req.body.email, req.body.password, clientIp);

    if (user) {
      return res.sendStatus(201);
    }
    return res.sendStatus(400);
  });


