import {Request, Response} from "express";
import {ioc} from "../IoCContainer";
import {MongoHasNotUpdated} from "../middlewares/errorsMessages";
import requestIp from "request-ip";
import {UsersAccountService} from "../domain/usersAccount-service";


export class UsersAccountController {
  constructor(private usersAccountService: UsersAccountService) {
  }

  async getUsers(req: Request, res: Response) {
    try {
      const parseQueryData = await ioc.parseQuery.parse(req)
      const pageNumber: number = parseQueryData.pageNumber
      const pageSize: number = parseQueryData.pageSize
      const searchLoginTerm: string | null = parseQueryData.searchLoginTerm
      const searchEmailTerm: string | null = parseQueryData.searchEmailTerm
      const sortBy: string | null = parseQueryData.sortBy
      const sortDirection: string | null = parseQueryData.sortDirection

      const getUsers = await this.usersAccountService.findUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
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

  async createNewUser(req: Request, res: Response) {
    try {
      const clientIp = requestIp.getClientIp(req);
      const userAccount = await ioc.usersAccountService.createUser(req.body.login, req.body.email, req.body.password, clientIp);

      if (userAccount) {
        const userReturn = {
          id: userAccount.accountData.id,
          login: userAccount.accountData.login,
          email: userAccount.accountData.email,
          createdAt: userAccount.accountData.createdAt
        }
        res.status(201).send(userReturn)
        return
      }
      res.status(501).send({MongoHasNotUpdated})

    } catch (e) {
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
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  }
}