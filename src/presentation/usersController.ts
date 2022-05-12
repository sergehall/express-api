import {ObjectId} from "mongodb";
import {Request, Response} from "express";
import {UsersService} from "../domain/users-service";
import {ioc} from "../IoCContainer";
import {MongoHasNotUpdated} from "../middlewares/input-validator-middleware";


export class UsersController {
  constructor(private usersService: UsersService) {
  }
  async getUserByMongoDbId(req: Request, res: Response) {
    try {
      const mongoId = new ObjectId(req.params.mongoId)
      const getUser = await this.usersService.findUser(mongoId)
      if(!getUser) {
        res.status(404).send()
      } else {
        res.send(getUser)
      }
    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }
  async createNewUser(req: Request, res: Response) {
    try {
      const newUsers = await ioc.usersService.createUser(req.body.login, req.body.email, req.body.password)
      if(newUsers === null) {
        res.status(501).send({MongoHasNotUpdated})
      }
      res.status(201).send(newUsers)
    }catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }
}