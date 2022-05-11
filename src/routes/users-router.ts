import {Router, Response, Request} from "express";
import {ioc} from "../IoCContainer";
import {ObjectId} from "mongodb";
import {
  bodyEmail,
  bodyLogin,
  bodyPassword,
  checkoutMongoDbId,
  inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";


export const usersRouter = Router({});


usersRouter.post('/', bodyLogin, bodyEmail, bodyPassword, inputValidatorMiddleware,
  async (req: Request, res: Response) => {
    const newUsers = await ioc.userService.createUser(req.body.login, req.body.email, req.body.password)
    res.status(201).send(newUsers)
  })
  .get('/:mongoId', checkoutMongoDbId,
    async (req: Request, res: Response) => {
      try {
        const mongoId = new ObjectId(req.params.mongoId)
        const getUser = await ioc.userService.findUser(mongoId)
        if(!getUser) {
          res.status(404).send()
        } else {
          res.send(getUser)
        }
      } catch (e) {
        console.log(e)
        return res.sendStatus(500)
      }
    })