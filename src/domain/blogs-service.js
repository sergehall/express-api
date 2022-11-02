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
exports.BlogsService = void 0;
class BlogsService {
    constructor(blogsRepository) {
        this.blogsRepository = blogsRepository;
        this.blogsRepository = blogsRepository;
    }
    findBlogs(pageNumber, pageSize, title, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.findBlogs(pageNumber, pageSize, title, sortBy, sortDirection);
        });
    }
    createBlog(name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.createBlog(name, youtubeUrl);
        });
    }
    createNewPostByBlogId(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.createNewPostByBlogId(title, shortDescription, content, blogId);
        });
    }
    getAllPostsByBlog(pageNumber, pageSize, sortBy, sortDirection, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.findAllPostsByBlog(pageNumber, pageSize, sortBy, sortDirection, blogId);
        });
    }
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.findBlogById(id);
        });
    }
    updatedBlogById(name, youtubeUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.updatedBlogById(name, youtubeUrl, id);
        });
    }
    deletedBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.deletedBlogById(id);
        });
    }
}
exports.BlogsService = BlogsService;
//# sourceMappingURL=blogs-service.js.map