import {Request, Response} from "express";


export async function parseQuery(req: Request, res: Response) {
  let pageNumber: number = parseInt(<string>req.query.PageNumber)
  let pageSize: number = parseInt(<string>req.query.PageSize)
  let searchNameTerm: string | null;

  if (req.query.SearchNameTerm && req.query.SearchNameTerm?.length !== 0) {
    searchNameTerm = req.query.SearchNameTerm.toString()
  } else {
    searchNameTerm = null
  }
  if (isNaN(pageNumber)) {
    pageNumber = 1
  }
  if (isNaN(pageSize)) {
    pageSize = 10
  }
   return {
    pageNumber: pageNumber,
    pageSize: pageSize,
    searchNameTerm: searchNameTerm}
}
