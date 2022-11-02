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
exports.testingRouter = void 0;
const express_1 = require("express");
const EmailsToSentSchemaModel_1 = require("../mongoose/EmailsToSentSchemaModel");
const BlackListIPSchemaModel_1 = require("../mongoose/BlackListIPSchemaModel");
const CommentsSchemaModel_1 = require("../mongoose/CommentsSchemaModel");
const BloggersSchemaModel_1 = require("../mongoose/BloggersSchemaModel");
const PostsSchemaModel_1 = require("../mongoose/PostsSchemaModel");
const BlackListRefreshTokenJWTModel_1 = require("../mongoose/BlackListRefreshTokenJWTModel");
const Last10secRegEmailResModel_1 = require("../mongoose/Last10secRegEmailResModel");
const Last10secLogModel_1 = require("../mongoose/Last10secLogModel");
const Last10secRegModel_1 = require("../mongoose/Last10secRegModel");
const Last10secRegConfModel_1 = require("../mongoose/Last10secRegConfModel");
const UsersAccountsSchemaModel_1 = require("../mongoose/UsersAccountsSchemaModel");
const UsersSchemaModel_1 = require("../mongoose/UsersSchemaModel");
const PostsBlogSchemaModel_1 = require("../mongoose/PostsBlogSchemaModel");
const BlogsSchemaModel_1 = require("../mongoose/BlogsSchemaModel");
const likeStatusPosts_1 = require("../mongoose/likeStatusPosts");
const ThreeLastLikesPost_1 = require("../mongoose/ThreeLastLikesPost");
const likeStatusComment_1 = require("../mongoose/likeStatusComment");
const DevicesSchemaModel_1 = require("../mongoose/DevicesSchemaModel");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter
    .delete("/all-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield UsersAccountsSchemaModel_1.MyModelUserAccount.deleteMany({});
    yield UsersSchemaModel_1.MyModelUser.deleteMany({});
    yield BlogsSchemaModel_1.MyModelBlogs.deleteMany({});
    yield PostsSchemaModel_1.MyModelPosts.deleteMany({});
    yield PostsBlogSchemaModel_1.MyModelBlogPosts.deleteMany({});
    yield likeStatusPosts_1.MyModelLikeStatusPostsId.deleteMany({});
    yield DevicesSchemaModel_1.MyModelDevicesSchema.deleteMany({});
    yield likeStatusComment_1.MyModelLikeStatusCommentId.deleteMany({});
    yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.deleteMany({});
    yield EmailsToSentSchemaModel_1.MyModelEmailsToSent.deleteMany({});
    yield BlackListIPSchemaModel_1.MyModelBlackListIP.deleteMany({});
    yield Last10secRegConfModel_1.MyModeLast10secRegConf.deleteMany({});
    yield Last10secRegModel_1.MyModeLast10secReg.deleteMany({});
    yield Last10secLogModel_1.MyModeLast10secLog.deleteMany({});
    yield Last10secRegEmailResModel_1.MyModeLast10secRedEmailRes.deleteMany({});
    yield CommentsSchemaModel_1.MyModelComments.deleteMany({});
    yield BlackListRefreshTokenJWTModel_1.MyModelBlackListRefreshTokenJWT.deleteMany({});
    yield BloggersSchemaModel_1.MyModelBloggers.deleteMany({});
    return res.status(204).send();
}));
//# sourceMappingURL=testing-router.js.map