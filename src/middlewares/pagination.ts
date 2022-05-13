import {Request, Response, NextFunction} from "express";
type Pagination = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: object
}

// export function paginatedResult(model) {
//   return (req: Request, res: Response, next: NextFunction) {
//     const page = parseInt(req.query.page)
//     const totalCount = parseInt(req.query.totalCount)
//
//     const
//
//   }
// }