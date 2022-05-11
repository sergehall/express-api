import {Request, Response, Router} from "express";
import {ioc} from "../IoCContainer";
import {
  bloggerIdParamsValidation,
  inputValidatorMiddleware,
  nameValidation, validatorUrl,
} from "../middlewares/input-validator-middleware";
import {authMiddlewareHeadersAuthorization} from "../middlewares/auth-middleware";
import {ArrayBloggersType} from "../types/all_types";


export const bloggersRouts = Router({})


bloggersRouts.get('/',
  async (req: Request, res: Response) => {
    const foundBloggers: ArrayBloggersType = await ioc.bloggersService.findBloggers(req.query.youtubeUrl?.toString())
    // @ts-ignore
    foundBloggers.map(i => delete i._id)
    res.send(foundBloggers)
  })

  .post('/', authMiddlewareHeadersAuthorization,
    nameValidation, validatorUrl, inputValidatorMiddleware,
    async (req: Request, res: Response) => {
      try {
        const name = req.body.name;
        const youtubeUrl = req.body.youtubeUrl
        const createNewBlogger = await ioc.bloggersService.createNewBlogger(name, youtubeUrl)

        if (createNewBlogger.resultCode == 0) {
          // @ts-ignore
          delete createNewBlogger.data._id
          res.status(201)
          res.send(createNewBlogger.data)
        } else {
          const errorsMessages = createNewBlogger.errorsMessages
          const resultCode = createNewBlogger.resultCode
          res.status(400)
          res.send({errorsMessages, resultCode})
        }
      } catch (error) {
        return res.sendStatus(500)
      }
    })

  .get('/:bloggerId', bloggerIdParamsValidation, inputValidatorMiddleware,
    async (req: Request, res: Response) => {
      try {
        const id = +req.params.bloggerId;
        const getBlogger = await ioc.bloggersService.getBloggerById(id);
        if (getBlogger) {
          const blogger = {
            id: getBlogger.id,
            name: getBlogger.name,
            youtubeUrl: getBlogger.youtubeUrl
          }
          res.send(blogger)
        } else {
          res.sendStatus(404)
        }
      } catch (error) {
        return res.sendStatus(500)
      }
    })

  .put('/:bloggerId', authMiddlewareHeadersAuthorization,
    bloggerIdParamsValidation, nameValidation, validatorUrl, inputValidatorMiddleware,
    async (req: Request, res: Response) => {
      try {
        const id = +req.params.bloggerId;
        const name = req.body.name;
        const youtubeUrl = req.body.youtubeUrl

        const updatedBlogger = await ioc.bloggersService.updateBloggerById(id, name, youtubeUrl)

        if (updatedBlogger.resultCode === 0) {
          res.status(204)
          res.send()
        } else {
          if (updatedBlogger.errorsMessages.find(f => f.field === "bloggerId")) {
            res.status(404)
            res.send()
          } else {
            const errorsMessages = updatedBlogger.errorsMessages
            const resultCode = updatedBlogger.resultCode
            res.status(400)
            res.send({errorsMessages, resultCode})
          }
        }
      } catch (error) {
        return res.sendStatus(500)
      }
    })

  .delete('/:bloggerId', authMiddlewareHeadersAuthorization,
    bloggerIdParamsValidation, inputValidatorMiddleware,
    async (req: Request, res: Response) => {
      const id = +req.params.bloggerId
      const deletedBlogger = await ioc.bloggersService.deletedBloggerById(id);

      if (deletedBlogger) {
        res.sendStatus(204)
      } else {
        res.sendStatus(404)
      }
    })