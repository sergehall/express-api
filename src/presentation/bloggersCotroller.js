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
exports.BloggersController = void 0;
const IoCContainer_1 = require("../IoCContainer");
class BloggersController {
    constructor(bloggersService, postsService) {
        this.bloggersService = bloggersService;
        this.postsService = postsService;
        this.bloggersService = bloggersService;
        this.postsService = postsService;
    }
    getAllBloggers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
            const pageNumber = parseQueryData.pageNumber;
            const pageSize = parseQueryData.pageSize;
            const searchNameTerm = parseQueryData.searchNameTerm;
            const foundBloggers = yield this.bloggersService.findBloggers(pageNumber, pageSize, searchNameTerm);
            res.send(foundBloggers);
        });
    }
    getAllPostByBloggerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.bloggerId;
            const foundBlogger = yield this.bloggersService.getBloggerById(id);
            const user = req.user;
            if (foundBlogger.errorsMessages.length === 0) {
                const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
                const pageNumber = parseQueryData.pageNumber;
                const pageSize = parseQueryData.pageSize;
                const foundPosts = yield this.postsService.findPostsByBloggerId(id, pageNumber, pageSize, user);
                res.send(foundPosts);
            }
            else {
                res.status(404);
                res.send();
            }
        });
    }
    createPostByBloggerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addedAt = (new Date()).toISOString();
                const blogId = req.params.blogId;
                const title = req.body.title;
                const shortDescription = req.body.shortDescription;
                const content = req.body.content;
                const createPosts = yield this.postsService.createPost(title, shortDescription, content, blogId, addedAt);
                if (createPosts.errorsMessages.length === 0) {
                    res.status(201);
                    return res.send({
                        id: createPosts.data.id,
                        title: createPosts.data.title,
                        shortDescription: createPosts.data.shortDescription,
                        content: createPosts.data.content,
                        blogId: createPosts.data.blogId,
                        blogName: createPosts.data.blogName,
                        addedAt: createPosts.data.addedAt,
                        extendedLikesInfo: {
                            likesCount: Number(createPosts.data.extendedLikesInfo.likesCount),
                            dislikesCount: Number(createPosts.data.extendedLikesInfo.dislikesCount),
                            myStatus: createPosts.data.extendedLikesInfo.myStatus,
                            newestLikes: createPosts.data.extendedLikesInfo.newestLikes
                        }
                    });
                }
                res.status(404);
                res.send();
            }
            catch (e) {
                console.log(e);
                res.status(500);
            }
        });
    }
    createNewBlogger(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.body.name;
                const youtubeUrl = req.body.youtubeUrl;
                const createNewBlogger = yield this.bloggersService.createNewBlogger(name, youtubeUrl);
                if (createNewBlogger.resultCode === 0) {
                    res.status(201);
                    res.send(createNewBlogger.data);
                }
                else {
                    const errorsMessages = createNewBlogger.errorsMessages;
                    const resultCode = createNewBlogger.resultCode;
                    res.status(400);
                    res.send({ errorsMessages, resultCode });
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    getBloggerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.bloggerId;
                const getBlogger = yield this.bloggersService.getBloggerById(id);
                if (getBlogger.data.id !== null) {
                    res.send(getBlogger.data);
                }
                else {
                    res.sendStatus(404);
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    updateBloggerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.bloggerId;
                const name = req.body.name;
                const youtubeUrl = req.body.youtubeUrl;
                const updatedBlogger = yield this.bloggersService.updateBloggerById(id, name, youtubeUrl);
                if (updatedBlogger.resultCode === 0) {
                    res.status(204);
                    res.send();
                    return;
                }
                if (updatedBlogger.errorsMessages.find(f => f.field === "bloggerId")) {
                    res.status(404);
                    res.send();
                    return;
                }
                const errorsMessages = updatedBlogger.errorsMessages;
                const resultCode = updatedBlogger.resultCode;
                res.status(400);
                res.send({ errorsMessages, resultCode });
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    deleteBloggerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.bloggerId;
            const deletedBlogger = yield this.bloggersService.deletedBloggerById(id);
            if (deletedBlogger) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    deleteAllBloggers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedBlogger = yield this.bloggersService.deletedAllBloggers();
            if (deletedBlogger) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
}
exports.BloggersController = BloggersController;
//# sourceMappingURL=bloggersCotroller.js.map