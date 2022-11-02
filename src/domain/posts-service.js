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
exports.PostsService = void 0;
class PostsService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
        this.postsRepository = postsRepository;
    }
    findPosts(pageNumber, pageSize, title, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.findPosts(pageNumber, pageSize, title, currentUser);
        });
    }
    findPostsByBloggerId(bloggerId, pageNumber, pageSize, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.findPostsByBloggerId(bloggerId, pageNumber, pageSize, user);
        });
    }
    createPost(title, shortDescription, content, blogId, addedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.createPost(title, shortDescription, content, blogId, addedAt);
        });
    }
    createNewCommentByPostId(postId, content, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.createNewCommentByPostId(postId, content, user);
        });
    }
    getPostById(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getPostById(id, user);
        });
    }
    getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection, user);
        });
    }
    updatePostById(id, title, shortDescription, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.updatePostById(id, title, shortDescription, content, bloggerId);
        });
    }
    deletedById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.deletePostById(id);
        });
    }
    deletedAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.deletedAllPosts();
        });
    }
    changeLikeStatusPost(user, postId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.changeLikeStatusPost(user, postId, likeStatus);
        });
    }
}
exports.PostsService = PostsService;
//# sourceMappingURL=posts-service.js.map