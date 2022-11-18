import {Request, Response} from "express";
import {ioc} from "../IoCContainer";
import requestIp from "request-ip";
import {UsersService} from "../domain/users-service";


export class UsersController {
  constructor(private usersService: UsersService) {
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

      const getUsers = await this.usersService.findUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
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
      const userAgent = req.header('user-agent') ? `${req.header('user-agent')}` : '';
      const newUser = await ioc.usersService.createUser(req.body.login, req.body.email, req.body.password, clientIp, userAgent);
      if (newUser) {
        return res.status(201).send({
          id: newUser.accountData.id,
          login: newUser.accountData.login,
          email: newUser.accountData.email,
          createdAt: newUser.registrationData.createdAt
        })
      }
      return res.status(400).send({
        errorsMessages: [
          {
            message: "Email or Login already exists",
            field: "Login or email"
          }
        ]
      })

    } catch (e: any) {
      console.log(e.toString())
      return res.sendStatus(400)
    }
  }

  async deleteUserById(req: Request, res: Response) {
    try {
      const id = req.params.id
      const deletedPost = await ioc.usersService.deleteUserById(id)

      if (!deletedPost) {
        return res.sendStatus(404)
      }
      return res.sendStatus(204)
    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }
}