import {Request} from "express";
import {injectable} from "inversify";
import {SortOrder} from "../types/tsTypes";



@injectable()
export class ParseQuery {
  async parse(req: Request) {
    let pageNumber: number = parseInt(<string>req.query.pageNumber)
    let pageSize: number = parseInt(<string>req.query.pageSize)
    let searchNameTerm: string | undefined | null = req.query.searchNameTerm?.toString()
    let searchLoginTerm: string | undefined | null = req.query.searchLoginTerm?.toString()
    let searchEmailTerm: string | undefined | null = req.query.searchEmailTerm?.toString()
    let title: string | undefined | null = req.query.title?.toString()
    let userName: string | undefined | null = req.query.userName?.toString()
    let searchTitle: string | undefined | null = req.query.searchTitle?.toString()
    let code: string | undefined | null = req.query.code?.toString()
    let confirmationCode: string | undefined | null = req.query.confirmationCode?.toString()
    let sortBy: string | undefined | null = req.query.sortBy?.toString()
    let querySortDir: any = req.query.sortDirection

    // default settings for searchNameTer, title, pageNumber, pageSize
    if (!searchNameTerm || searchNameTerm.length === 0) {
      searchNameTerm = null
    }
    if (!searchLoginTerm || searchLoginTerm.length === 0) {
      searchLoginTerm = null
    }
    if (!searchEmailTerm || searchEmailTerm.length === 0) {
      searchEmailTerm = null
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
    if (!sortBy || sortBy.length === 0) {
      sortBy = null
    }
    const sortOrderArr = [-1, 1, 'descending', 'desc', 'ascending', 'asc']
    let sortDirection: SortOrder = 1;
    if (sortOrderArr.includes(querySortDir)) {
      sortDirection = querySortDir;
    }
    if (Number(querySortDir) === -1) {
      sortDirection = -1;
    }

    return {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchNameTerm: searchNameTerm,
      title: title,
      userName: userName,
      searchTitle: searchTitle,
      code: code,
      confirmationCode: confirmationCode,
      sortBy: sortBy,
      sortDirection: sortDirection,
      searchLoginTerm: searchLoginTerm,
      searchEmailTerm: searchEmailTerm
    }
  }
}

