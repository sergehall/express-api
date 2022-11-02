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
exports.PostsController = void 0;
const IoCContainer_1 = require("../IoCContainer");
class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
            const pageNumber = parseQueryData.pageNumber;
            const pageSize = parseQueryData.pageSize;
            const title = parseQueryData.title;
            const currentUser = req.user;
            const foundPosts = yield this.postsService.findPosts(pageNumber, pageSize, title, currentUser);
            res.send(foundPosts);
        });
    }
    createNewPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const title = req.body.title;
                const shortDescription = req.body.shortDescription;
                const content = req.body.content;
                const blogId = req.body.blogId;
                const addedAt = (new Date()).toISOString();
                const newPost = yield this.postsService.createPost(title, shortDescription, content, blogId, addedAt);
                if (newPost.resultCode === 0) {
                    res.status(201);
                    return res.send({
                        id: newPost.data.id,
                        title: newPost.data.title,
                        shortDescription: newPost.data.shortDescription,
                        content: newPost.data.content,
                        blogId: newPost.data.blogId,
                        blogName: newPost.data.blogName,
                        addedAt: newPost.data.addedAt,
                        extendedLikesInfo: {
                            likesCount: Number(newPost.data.extendedLikesInfo.likesCount),
                            dislikesCount: Number(newPost.data.extendedLikesInfo.dislikesCount),
                            myStatus: newPost.data.extendedLikesInfo.myStatus,
                            newestLikes: newPost.data.extendedLikesInfo.newestLikes
                        }
                    });
                }
                else {
                    res.status(400);
                    const errorsMessages = newPost.errorsMessages;
                    const resultCode = newPost.resultCode;
                    res.send({ errorsMessages, resultCode });
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    createNewCommentByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const content = req.body.content;
                const user = req.user;
                if (!user) {
                    res.status(401);
                    res.send();
                    return;
                }
                const newPost = yield this.postsService.createNewCommentByPostId(postId, content, user);
                if (newPost.resultCode === 0) {
                    res.status(201);
                    res.send(newPost.data);
                    return;
                }
                if (newPost.errorsMessages.find(f => f.field === "postId")) {
                    res.status(404);
                    res.send();
                    return;
                }
                res.status(400);
                const errorsMessages = newPost.errorsMessages;
                const resultCode = newPost.resultCode;
                res.send({ errorsMessages, resultCode });
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const user = req.user;
                const getPost = yield this.postsService.getPostById(postId, user);
                if (!getPost) {
                    res.status(404).send();
                }
                else {
                    res.send(getPost);
                    return;
                }
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        });
    }
    getCommentsByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
                const pageNumber = parseQueryData.pageNumber;
                const pageSize = parseQueryData.pageSize;
                const sortBy = parseQueryData.sortBy;
                const sortDirection = parseQueryData.sortDirection;
                const user = req.user;
                const getPost = yield this.postsService.getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection, user);
                if (getPost.pageSize === 0) {
                    return res.status(404).send();
                }
                return res.send(getPost);
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    updatePostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.postId;
                const title = req.body.title;
                const shortDescription = req.body.shortDescription;
                const content = req.body.content;
                const bloggerId = req.body.bloggerId;
                const updatedPost = yield this.postsService.updatePostById(id, title, shortDescription, content, bloggerId);
                if (updatedPost.resultCode === 0) {
                    res.status(204);
                    res.send();
                    return;
                }
                if (updatedPost.errorsMessages.find(p => p.field === "postId")) {
                    res.status(404);
                    res.send();
                    return;
                }
                res.status(400);
                const errorsMessages = updatedPost.errorsMessages;
                const resultCode = updatedPost.resultCode;
                return res.send({ errorsMessages, resultCode });
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        });
    }
    deletePostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.postId;
            const deletedPost = yield this.postsService.deletedById(id);
            if (deletedPost) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    deleteAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedPost = yield this.postsService.deletedAllPosts();
            if (deletedPost) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    likeStatusPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const likeStatus = req.body.likeStatus;
            const postId = req.params.postId;
            const user = req.user;
            const likeStatusPost = yield this.postsService.changeLikeStatusPost(user, postId, likeStatus);
            if (!likeStatusPost) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
}
exports.PostsController = PostsController;
//# sourceMappingURL=postsController.js.map