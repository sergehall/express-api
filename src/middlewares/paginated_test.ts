import {NextFunction, Request, Response, Router} from "express";
import {Pagination} from "../types/all_types";


const model: any = [
  {id: 1, name: 'Dimych', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
  {id: 2, name: 'Лекс', youtubeUrl: 'https://www.youtube.com/c/ITBEARD'},
  {id: 3, name: 'Lex Fridman', youtubeUrl: 'https://www.youtube.com/c/lexfridman'},
  {id: 4, name: 'Тимофей Хирьянов', youtubeUrl: 'https://www.youtube.com/c/ТимофейХирьянов'},
  {id: 5, name: 'SpaceX', youtubeUrl: 'https://www.youtube.com/c/SpaceX'},
  {id: 6, name: 'Dimych', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
  {id: 7, name: 'Лекс', youtubeUrl: 'https://www.youtube.com/c/ITBEARD'},
  {id: 8, name: 'Lex Fridman', youtubeUrl: 'https://www.youtube.com/c/lexfridman'},
  {id: 9, name: 'Тимофей Хирьянов', youtubeUrl: 'https://www.youtube.com/c/ТимофейХирьянов'},
  {id: 10, name: 'SpaceX', youtubeUrl: 'https://www.youtube.com/c/SpaceX'},
  {id: 11, name: 'SpaceX', youtubeUrl: 'https://www.youtube.com/c/SpaceX'},
  {id: 12, name: 'SpaceX', youtubeUrl: 'https://www.youtube.com/c/SpaceX'}
]

// const model: any = [
//   {
//     id: 1,
//     title: 'Dimych post',
//     shortDescription: 'Why do we use it?',
//     content: "It is a long established fact that a reader will be distracted by the readable " +
//       "content of a page when looking at its layout. The point of using Lorem Ipsum is that",
//     bloggerId: 1,
//     bloggerName: "Dimych"
//   },
//   {
//     id: 2,
//     title: 'Лекс post',
//     shortDescription: 'Where can I get some?',
//     content: "There are many variations of passages of Lorem Ipsum available, but the" +
//       " majority have suffered alteration in some form, by injected humour,",
//     bloggerId: 2,
//     bloggerName: "Лекс"
//   },
//   {
//     id: 3,
//     title: 'Lex Fridman post',
//     shortDescription: 'Where does it come from?',
//     content: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots " +
//       "in a piece of classical Latin literature from 45 BC, making",
//     bloggerId: 3,
//     bloggerName: "Lex Fridman"
//   },
//   {
//     id: 4,
//     title: 'Тимофей Хирьянов post',
//     shortDescription: 'What is Lorem Ipsum?',
//     content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
//       "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
//     bloggerId: 4,
//     bloggerName: "Тимофей Хирьянов"
//   },
//   {
//     id: 5,
//     title: 'SpaceX post',
//     shortDescription: 'RESERVE YOUR RIDE ONLINE',
//     content: "Find all the information you need to make a reservation online, everything from " +
//       "port size to technical specifications to licensing information. Once your reservation " +
//       "request is approved, SpaceX will provide you with a welcome package outlining next" +
//       " steps for launch.",
//     bloggerId: 5,
//     bloggerName: "SpaceX"
//   }
// ]

// const model: any = []

export const paginatedRouter = Router({})

export  function paginatedResults(model: any[]) {
  if (!model) {
    return  async (next: NextFunction) => next()
  } else {
    return async (req: Request, res: Response, next: NextFunction) => {
      let pageNumber: number = parseInt(<string>req.query.PageNumber)
      let pageSize: number = parseInt(<string>req.query.PageSize)
      // const products = await Product.fin

      const results: Pagination = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      }
      if(isNaN(pageNumber)) {
        pageNumber = results.page
      }
      if(isNaN(pageSize)) {
        pageSize = results.pageSize
      }

      const startIndex = (pageNumber - 1) * pageSize // page
      const endIndex = pageNumber * pageSize // pageSize
      const totalCount = model.length

      results.pagesCount = Math.ceil(totalCount / pageSize)
      results.page = pageNumber
      results.pageSize = pageSize
      results.totalCount = totalCount
      results.items = model.slice(startIndex, endIndex)
      res.json(results)
    }
  }
}


paginatedRouter.get('/', paginatedResults(model),
  (req: Request, res: Response) => {
    if (model) {
      res.send(res)
    } else {
      res.status(400)
    }
  })

