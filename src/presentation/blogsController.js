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
exports.BlogsController = void 0;
const IoCContainer_1 = require("../IoCContainer");
class BlogsController {
    constructor(blogsService) {
        this.blogsService = blogsService;
    }
    getAllBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
            const pageNumber = parseQueryData.pageNumber;
            const pageSize = parseQueryData.pageSize;
            const title = parseQueryData.title;
            const sortBy = parseQueryData.sortBy;
            const sortDirection = parseQueryData.sortDirection;
            const foundBlogs = yield this.blogsService.findBlogs(pageNumber, pageSize, title, sortBy, sortDirection);
            return res.send(foundBlogs);
        });
    }
    createNewBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.body.name;
                const youtubeUrl = req.body.youtubeUrl;
                const newBlog = yield this.blogsService.createBlog(name, youtubeUrl);
                if (newBlog.data !== null && newBlog.resultCode === 0) {
                    res.status(201);
                    res.send({
                        id: newBlog.data.id,
                        name: newBlog.data.name,
                        youtubeUrl: newBlog.data.youtubeUrl,
                        createdAt: newBlog.data.createdAt
                    });
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    createNewPostByBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = req.body.title;
            const shortDescription = req.body.shortDescription;
            const content = req.body.content;
            const blogId = req.params.blogId;
            const newBlogPost = yield this.blogsService.createNewPostByBlogId(title, shortDescription, content, blogId);
            if (newBlogPost.errorsMessages.length !== 0) {
                res.status(404);
                return res.send();
            }
            if (newBlogPost.data !== null) {
                res.status(201);
                return res.send({
                    id: newBlogPost.data.id,
                    title: newBlogPost.data.title,
                    shortDescription: newBlogPost.data.shortDescription,
                    content: newBlogPost.data.content,
                    blogId: newBlogPost.data.blogId,
                    blogName: newBlogPost.data.blogName,
                    createdAt: newBlogPost.data.createdAt
                });
            }
        });
    }
    getAllPostsByBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.blogId;
            const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
            const pageNumber = parseQueryData.pageNumber;
            const pageSize = parseQueryData.pageSize;
            const sortBy = parseQueryData.sortBy;
            const sortDirection = parseQueryData.sortDirection;
            const allPostsByBlog = yield this.blogsService.getAllPostsByBlog(pageNumber, pageSize, sortBy, sortDirection, blogId);
            if (allPostsByBlog === null) {
                return res.sendStatus(404);
            }
            return res.send(allPostsByBlog);
        });
    }
    findBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const getBlog = yield this.blogsService.findBlogById(id);
                if (getBlog) {
                    res.send(getBlog);
                }
                else {
                    res.status(404).send();
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    updatedBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.body.name;
                const youtubeUrl = req.body.youtubeUrl;
                const id = req.params.id;
                const updatedBlog = yield this.blogsService.updatedBlogById(name, youtubeUrl, id);
                if (updatedBlog.resultCode === 0) {
                    res.status(204);
                    return res.send();
                }
                if (updatedBlog.errorsMessages.find(p => p.field === "blogId")) {
                    res.status(404);
                    return res.send();
                }
                res.status(400);
                const errorsMessages = updatedBlog.errorsMessages;
                const resultCode = updatedBlog.resultCode;
                return res.send({ errorsMessages, resultCode });
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        });
    }
    deleteBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const deletedBlog = yield this.blogsService.deletedBlogById(id);
            if (deletedBlog) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
}
exports.BlogsController = BlogsController;
//# sourceMappingURL=blogsController.js.map