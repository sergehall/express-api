import {Request, Response} from "express";
import {UsersService} from "../domain/users-service";
import {ioc} from "../IoCContainer";
import requestIp from "request-ip";
import {mongoHasNotUpdated} from "../middlewares/errorsMessages";


export class UsersController {
  constructor(private usersService: UsersService) {
  }

  async getUsers(req: Request, res: Response) {
    try {
      const parseQueryData = await ioc.parseQuery.parse(req)
      const pageNumber: number = parseQueryData.pageNumber
      const pageSize: number = parseQueryData.pageSize
      const userName: string | null = parseQueryData.userName

      const getUsers = await this.usersService.findUsers(pageNumber, pageSize, userName)
      if (!getUsers) {
        res.status(404).send()
      } else {
        res.send(getUsers)
      }
    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }

  async getUserByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.mongoId
      const getUser = await this.usersService.findUser(userId)
      if (!getUser) {
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
      const clientIp = requestIp.getClientIp(req);
      const userAccount = await ioc.usersAccountService.createUser(req.body.login, req.body.email, req.body.password, clientIp);

      if (userAccount) {
        const userReturn = {
          id: userAccount.accountData.id,
          email: userAccount.accountData.email,
          login: userAccount.accountData.login,
          createdAt: userAccount.accountData.createdAt
        }
        res.status(201).send(userReturn)
        return
      }
      res.status(501).send({mongoHasNotUpdated})

    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }

  async deleteUserById(req: Request, res: Response) {
    try {
      const id = req.params.userId
      const deletedPost =  await this.usersService.deleteUserById(id)

      if (deletedPost) {
        res.sendStatus(204)
      } else {
        res.sendStatus(404)
      }
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  }
}