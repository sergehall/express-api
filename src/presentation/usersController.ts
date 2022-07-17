import {ObjectId} from "mongodb";
import {Request, Response} from "express";
import {UsersService} from "../domain/users-service";
import {ioc} from "../IoCContainer";
import {MongoHasNotUpdated} from "../middlewares/input-validator-middleware";
import {parseQuery} from "../middlewares/parse-query";
import requestIp from "request-ip";


export class UsersController {
  constructor(private usersService: UsersService) {
  }
  async getUsers(req: Request, res: Response) {
    try {
      const parseQueryData = parseQuery(req)
      const pageNumber: number = parseQueryData.pageNumber
      const pageSize: number = parseQueryData.pageSize
      const userName: string | null = parseQueryData.userName

      const getUsers = await this.usersService.findUsers(pageNumber, pageSize, userName)
      if(!getUsers) {
        res.status(404).send()
      } else {
        res.send(getUsers)
      }
    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
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
      console.log("createNewUser", req.body.login, req.body.email, req.body.password)
      const clientIp = requestIp.getClientIp(req);
      const newUsers = await ioc.usersService.createUser(req.body.login, req.body.email, req.body.password)
      if (newUsers) {
        const userAccountForTest6 = await ioc.usersAccountService.createUser(newUsers, clientIp);
      }
      if (newUsers) {
        const userReturn = {
          id: newUsers.id,
          login: newUsers.login
        }
        res.status(201).send(userReturn)
        return
      }
      res.status(501).send({MongoHasNotUpdated})

    }catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }
  async deleteUserById(req: Request, res: Response) {
    try {
      const id = req.params.userId
      const deletedPost = await ioc.usersService.deleteUserById(id)

      if (deletedPost) {
        res.sendStatus(204)
      } else {
        res.sendStatus(404)
      }
    }catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  }
}