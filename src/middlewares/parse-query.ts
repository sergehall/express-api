import {Request} from "express";


export function parseQuery(req: Request) {

  let pageNumber: number = parseInt(<string>req.query.PageNumber)
  let pageSize: number = parseInt(<string>req.query.PageSize)
  let searchNameTerm: string | undefined | null = req.query.SearchNameTerm?.toString()
  let title: string | undefined | null = req.query.Title?.toString()
  let userName: string | undefined | null = req.query.UserName?.toString()

  // default settings for searchNameTer, title, pageNumber, pageSize
  if (!searchNameTerm || searchNameTerm.length === 0) {
    searchNameTerm = null
  }
  if (!title || title.length === 0) {
    title = null
  }
  if (!userName || userName.length === 0) {
    userName = null
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
    searchNameTerm: searchNameTerm,
    title: title,
    userName: userName
  }
}
