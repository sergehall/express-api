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
exports.BloggersService = void 0;
class BloggersService {
    constructor(bloggersRepository) {
        this.bloggersRepository = bloggersRepository;
        this.bloggersRepository = bloggersRepository;
    }
    findBloggers(pageNumber, pageSize, searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bloggersRepository.findBloggers(pageNumber, pageSize, searchNameTerm);
        });
    }
    createNewBlogger(name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bloggersRepository.createNewBlogger(name, youtubeUrl);
        });
    }
    getBloggerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bloggersRepository.getBloggerById(id);
        });
    }
    updateBloggerById(id, name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bloggersRepository.updateBloggerById(id, name, youtubeUrl);
        });
    }
    deletedBloggerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bloggersRepository.deletedBloggerById(id);
        });
    }
    deletedAllBloggers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bloggersRepository.deletedAllBloggers();
        });
    }
}
exports.BloggersService = BloggersService;
//# sourceMappingURL=bloggers-service.js.map