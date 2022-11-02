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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRepository = void 0;
const BlogsSchemaModel_1 = require("../mongoose/BlogsSchemaModel");
const uuid4_1 = __importDefault(require("uuid4"));
const errorsMessages_1 = require("../middlewares/errorsMessages");
const PostsBlogSchemaModel_1 = require("../mongoose/PostsBlogSchemaModel");
class BlogsRepository {
    findBlogs(pageNumber, pageSize, title, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            let sortFilter = {};
            if (title !== null) {
                filter = { title: { $regex: title } };
            }
            if (!sortDirection || sortDirection !== "asc") {
                sortDirection = "desc";
            }
            if (!sortBy || sortBy !== "name" && sortBy !== "youtubeUrl") {
                sortFilter = { "createdAt": sortDirection };
            }
            else if (sortBy === "name") {
                sortFilter = { "name": sortDirection };
            }
            else if (sortBy === "youtubeUrl") {
                sortFilter = { "youtubeUrl": sortDirection };
            }
            const startIndex = (pageNumber - 1) * pageSize;
            const result = yield BlogsSchemaModel_1.MyModelBlogs.find(filter, {
                _id: false,
                __v: false
            }).limit(pageSize).skip(startIndex).sort(sortFilter).lean();
            const totalCount = yield BlogsSchemaModel_1.MyModelBlogs.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: result
            };
        });
    }
    createBlog(name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorsArray = [];
            const newBlogId = (0, uuid4_1.default)().toString();
            const createdAt = new Date().toISOString();
            const createBlog = yield BlogsSchemaModel_1.MyModelBlogs.create({
                id: newBlogId,
                name: name,
                youtubeUrl: youtubeUrl,
                createdAt: createdAt
            });
            return {
                data: createBlog,
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    createNewPostByBlogId(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorsArray = [];
            const filter = { id: blogId };
            const verifyBlogIg = yield BlogsSchemaModel_1.MyModelBlogs.findOne(filter).lean();
            if (!verifyBlogIg) {
                errorsArray.push(errorsMessages_1.notFoundBlogId);
                return {
                    data: null,
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            const blogName = verifyBlogIg.name;
            const createdAt = (new Date()).toISOString();
            const newPostId = (0, uuid4_1.default)().toString();
            const newPostBlog = {
                id: newPostId,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blogName,
                createdAt: createdAt,
            };
            const filterBlogId = { blogId: blogId };
            const foundBlog = yield PostsBlogSchemaModel_1.MyModelBlogPosts.findOne(filterBlogId);
            if (!foundBlog) {
                const createNewBlog = yield PostsBlogSchemaModel_1.MyModelBlogPosts.create({
                    blogId: blogId,
                    allPosts: [newPostBlog]
                });
                if (!createNewBlog) {
                    errorsArray.push(errorsMessages_1.MongoHasNotUpdated);
                }
            }
            else {
                const result = yield PostsBlogSchemaModel_1.MyModelBlogPosts.updateOne({ blogId: blogId }, {
                    $push: { allPosts: newPostBlog }
                });
                if (!result.modifiedCount && !result.matchedCount) {
                    errorsArray.push(errorsMessages_1.MongoHasNotUpdated);
                }
            }
            if (errorsArray.length !== 0) {
                return {
                    data: null,
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            return {
                data: newPostBlog,
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    findAllPostsByBlog(pageNumber, pageSize, sortBy, sortDirection, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { blogId: blogId };
            const foundPostsBlog = yield PostsBlogSchemaModel_1.MyModelBlogPosts.findOne(filter);
            if (foundPostsBlog === null) {
                return null;
            }
            let totalCount = yield PostsBlogSchemaModel_1.MyModelBlogPosts.findOne(filter)
                .then(posts => posts === null || posts === void 0 ? void 0 : posts.allPosts.length);
            if (!totalCount) {
                totalCount = 0;
            }
            const pagesCount = Math.ceil(totalCount / pageSize);
            let desc = 1;
            let asc = -1;
            let field = "createdAt";
            if (sortDirection !== "asc") {
                desc = -1;
                asc = 1;
            }
            if (sortBy === "blogName" || sortBy === "shortDescription" || sortBy === "title" || sortBy === "content") {
                field = sortBy;
            }
            // sort array posts
            function byField(field, asc, desc) {
                return (a, b) => a[field] > b[field] ? asc : desc;
            }
            let posts = yield PostsBlogSchemaModel_1.MyModelBlogPosts.findOne(filter, {
                _id: false
            })
                .then(posts => posts === null || posts === void 0 ? void 0 : posts.allPosts.sort(byField(field, asc, desc)));
            if (!posts) {
                posts = [];
            }
            let startIndex = (pageNumber - 1) * pageSize;
            const postsSlice = posts.slice(startIndex, startIndex + pageSize);
            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: postsSlice
            };
        });
    }
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield BlogsSchemaModel_1.MyModelBlogs.findOne({ id: id }, {
                _id: false,
                __v: false,
            }).lean();
            if (!foundBlog) {
                return null;
            }
            return foundBlog;
        });
    }
    updatedBlogById(name, youtubeUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorsArray = [];
            const createdAt = (new Date()).toISOString();
            const searchBlog = yield BlogsSchemaModel_1.MyModelBlogs.findOne({ id: id });
            if (!searchBlog) {
                errorsArray.push(errorsMessages_1.notFoundBlogId);
            }
            const updatedBlog = yield BlogsSchemaModel_1.MyModelBlogs.updateOne({ id: id }, {
                $set: {
                    id: id,
                    name: name,
                    youtubeUrl: youtubeUrl,
                    createdAt: createdAt
                }
            }).lean();
            if (updatedBlog.matchedCount === 0) {
                errorsArray.push(errorsMessages_1.MongoHasNotUpdated);
            }
            const foundBlog = yield BlogsSchemaModel_1.MyModelBlogs.findOne({ id: id }, {
                _id: false,
                __v: false,
            }).lean();
            if (errorsArray.length !== 0 || !foundBlog) {
                return {
                    data: null,
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            return {
                data: foundBlog,
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    deletedBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield BlogsSchemaModel_1.MyModelBlogs.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
}
exports.BlogsRepository = BlogsRepository;
//# sourceMappingURL=blogs-db-repository.js.map