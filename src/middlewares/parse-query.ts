import {Request} from "express";


export function parseQuery(req: Request) {

  let pageNumber: number = parseInt(<string>req.query.PageNumber)
  let pageSize: number = parseInt(<string>req.query.PageSize)
  let searchNameTerm: string | undefined | null = req.query.SearchNameTerm?.toString()
  let title: string | undefined | null = req.query.Title?.toString()
  let userName: string | undefined | null = req.query.UserName?.toString()
  let searchTitle: string | undefined | null = req.query.SearchTitle?.toString()
  let code: string | undefined | null = req.query.Code?.toString()
  let confirmationCode: string | undefined | null = req.query.ConfirmationCode?.toString()

  // default settings for searchNameTer, title, pageNumber, pageSize
  if (!searchNameTerm || searchNameTerm.length === 0) {
    searchNameTerm = null
  }
  if (!confirmationCode || confirmationCode.length === 0) {
    confirmationCode = null
  }
  if (!code || code.length === 0) {
    code = null
  }
  if (!searchTitle || searchTitle.length === 0) {
    searchTitle = null
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
    userName: userName,
    searchTitle: searchTitle,
    code: code,
    confirmationCode: confirmationCode
  }
}
