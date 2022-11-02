"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseQuery = void 0;
class ParseQuery {
    parse(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            let pageNumber = parseInt(req.query.pageNumber);
            let pageSize = parseInt(req.query.pageSize);
            let searchNameTerm = (_a = req.query.searchNameTerm) === null || _a === void 0 ? void 0 : _a.toString();
            let searchLoginTerm = (_b = req.query.searchLoginTerm) === null || _b === void 0 ? void 0 : _b.toString();
            let searchEmailTerm = (_c = req.query.searchEmailTerm) === null || _c === void 0 ? void 0 : _c.toString();
            let title = (_d = req.query.title) === null || _d === void 0 ? void 0 : _d.toString();
            let userName = (_e = req.query.userName) === null || _e === void 0 ? void 0 : _e.toString();
            let searchTitle = (_f = req.query.searchTitle) === null || _f === void 0 ? void 0 : _f.toString();
            let code = (_g = req.query.code) === null || _g === void 0 ? void 0 : _g.toString();
            let confirmationCode = (_h = req.query.confirmationCode) === null || _h === void 0 ? void 0 : _h.toString();
            let sortBy = (_j = req.query.sortBy) === null || _j === void 0 ? void 0 : _j.toString();
            let sortDirection = (_k = req.query.sortDirection) === null || _k === void 0 ? void 0 : _k.toString();
            // default settings for searchNameTer, title, pageNumber, pageSize
            if (!searchNameTerm || searchNameTerm.length === 0) {
                searchNameTerm = null;
            }
            if (!searchLoginTerm || searchLoginTerm.length === 0) {
                searchLoginTerm = null;
            }
            if (!searchEmailTerm || searchEmailTerm.length === 0) {
                searchEmailTerm = null;
            }
            if (!confirmationCode || confirmationCode.length === 0) {
                confirmationCode = null;
            }
            if (!code || code.length === 0) {
                code = null;
            }
            if (!searchTitle || searchTitle.length === 0) {
                searchTitle = null;
            }
            if (!title || title.length === 0) {
                title = null;
            }
            if (!userName || userName.length === 0) {
                userName = null;
            }
            if (isNaN(pageNumber)) {
                pageNumber = 1;
            }
            if (isNaN(pageSize)) {
                pageSize = 10;
            }
            if (!sortBy || sortBy.length === 0) {
                sortBy = null;
            }
            if (!sortDirection || sortDirection.length === 0) {
                sortDirection = null;
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
            };
        });
    }
}
exports.ParseQuery = ParseQuery;
//# sourceMappingURL=parse-query.js.map