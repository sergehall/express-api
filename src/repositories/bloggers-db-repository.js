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
exports.BloggersRepository = void 0;
const errorsMessages_1 = require("../middlewares/errorsMessages");
const BloggersSchemaModel_1 = require("../mongoose/BloggersSchemaModel");
class BloggersRepository {
    findBloggers(pageNumber, pageSize, searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (searchNameTerm !== null) {
                filter = { name: { $regex: searchNameTerm } };
            }
            const startIndex = (pageNumber - 1) * pageSize;
            const result = yield BloggersSchemaModel_1.MyModelBloggers.find(filter, {
                _id: false,
                __v: false
            }).limit(pageSize).skip(startIndex);
            const totalCount = yield BloggersSchemaModel_1.MyModelBloggers.countDocuments(filter);
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
    createNewBlogger(name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorsArray = [];
            const newBlogId = (+new Date()).toString();
            const newBlogger = {
                id: newBlogId,
                name: name,
                youtubeUrl: youtubeUrl
            };
            const resultBloggers = yield BloggersSchemaModel_1.MyModelBloggers.create(newBlogger);
            if (!resultBloggers._id) {
                errorsArray.push(errorsMessages_1.MongoHasNotUpdated);
                return {
                    data: newBlogger,
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            return {
                data: newBlogger,
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    getBloggerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorsArray = [];
            const blogger = yield BloggersSchemaModel_1.MyModelBloggers.findOne({ id: id }, {
                _id: false,
                __v: false
            });
            if (!blogger) {
                errorsArray.push(errorsMessages_1.notFoundBloggerId);
                return {
                    data: {
                        id: null,
                        name: "",
                        youtubeUrl: ""
                    },
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            return {
                data: blogger,
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    updateBloggerById(id, name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorsArray = [];
            const data = {
                id: id,
                name: name,
                youtubeUrl: youtubeUrl
            };
            const result = yield BloggersSchemaModel_1.MyModelBloggers.updateOne({ id: id }, {
                $set: {
                    name: name,
                    youtubeUrl: youtubeUrl
                }
            });
            if (result.matchedCount === 0) {
                errorsArray.push(errorsMessages_1.notFoundBloggerId, errorsMessages_1.MongoHasNotUpdated);
            }
            if (errorsArray.length !== 0) {
                return {
                    data: data,
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            return {
                data: data,
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    deletedBloggerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield BloggersSchemaModel_1.MyModelBloggers.deleteOne({ id: id });
            return result.deletedCount !== 0;
            //   if (!id) {
            //     return false
            //   }
            //   // delete from bloggers array
            //   const blogger = bloggers.filter(v => v.id === id)
            //
            //   if (bloggers.filter(v => v.id === id) && bloggers.indexOf(blogger[0]) !== -1) {
            //     const newV = bloggers.indexOf(blogger[0]);
            //     bloggers.splice(newV, 1);
            //     try {
            //
            //       // If the blogger is in the array, then we call the function in the post repository
            //       // deletedAllPostsByBloggerId so that it deletes all posts with this bloggerId
            //       await deletedAllPostsByBloggerId(id);
            //
            //       // Checking the blogger in the deleted array, if it is not there, then push him there
            //       if (deletedBloggers.filter(v => v.id === id).length === 0) {
            //         deletedBloggers.push(blogger[0])
            //       }
            //     } catch (e) {
            //       console.log("Error => function deletedAllPostsByBloggerId. " +
            //         "Фунция сделана самостоятельно, не по заданию возможна ошибка при тестах.")
            //     }
            //   }
            //   return true
        });
    }
    deletedAllBloggers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield BloggersSchemaModel_1.MyModelBloggers.deleteMany({});
            return result.acknowledged;
        });
    }
}
exports.BloggersRepository = BloggersRepository;
//# sourceMappingURL=bloggers-db-repository.js.map