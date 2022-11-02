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
exports.bloggersRepository = exports.deletedBloggers = exports.bloggers = void 0;
const posts_repository_1 = require("./posts-repository");
exports.bloggers = [
    { id: 1, name: 'Dimych', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA' },
    { id: 2, name: 'Лекс', youtubeUrl: 'https://www.youtube.com/c/ITBEARD' },
    { id: 3, name: 'Lex Fridman', youtubeUrl: 'https://www.youtube.com/c/lexfridman' },
    { id: 4, name: 'Тимофей Хирьянов', youtubeUrl: 'https://www.youtube.com/c/ТимофейХирьянов' },
    { id: 5, name: 'SpaceX', youtubeUrl: 'https://www.youtube.com/c/SpaceX' },
];
exports.deletedBloggers = [];
const incorrectValues = {
    message: "inputName has incorrect values",
    field: "name"
};
const anEmptyObject = {
    message: "An empty object was received",
    field: "empty object"
};
const incorrectFieldYoutubeUrl = {
    "message": "The field YoutubeUrl must match the regular expression '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'.",
    "field": "youtubeUrl"
};
const notFoundBloggerId = {
    message: "Not found '/:bloggerId'",
    field: "bloggerId"
};
const youtubeUrlRegExp = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';
exports.bloggersRepository = {
    findBloggers(youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (youtubeUrl) {
                return exports.bloggers.filter(p => p.youtubeUrl.toLowerCase().split("/")[exports.bloggers[0].youtubeUrl.toLowerCase().split("/").length - 1].indexOf(youtubeUrl.toLowerCase()) > -1);
            }
            else {
                return exports.bloggers;
            }
        });
    },
    createNewBlogger(name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const errorsArray = [];
            if (!name || !youtubeUrl) {
                return {
                    data: {
                        id: 0,
                        name: name,
                        youtubeUrl: youtubeUrl
                    },
                    errorsMessages: [anEmptyObject],
                    resultCode: 1
                };
            }
            // create new unique id
            let newId = +(new Date());
            let count = 0;
            while (count < 10 && exports.bloggers.find(i => i.id === newId)) {
                newId = +(new Date());
                count++;
            }
            if (name.length <= 0 || name.length > 15) {
                errorsArray.push(incorrectValues);
                resultCode = 1;
            }
            if (youtubeUrl.match(youtubeUrlRegExp) === null || youtubeUrl.length > 100) {
                errorsArray.push(incorrectFieldYoutubeUrl);
                resultCode = 1;
            }
            const newBlogger = {
                id: 0,
                name: name,
                youtubeUrl: youtubeUrl
            };
            if (errorsArray.length === 0) {
                newBlogger.id = newId;
                exports.bloggers.push(newBlogger);
            }
            return {
                data: newBlogger,
                errorsMessages: errorsArray,
                resultCode: resultCode
            };
        });
    },
    getBloggerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogger = exports.bloggers.find(v => v.id === id);
            if (blogger) {
                return blogger;
            }
            else {
                return false;
            }
        });
    },
    updateBloggerById(id, name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            let errorsArray = [];
            const blogger = yield exports.bloggers.find(v => v.id === +id);
            if (!blogger) {
                errorsArray.push(notFoundBloggerId);
                return {
                    data: {
                        id: 0,
                        name: name,
                        youtubeUrl: youtubeUrl
                    },
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            if (name.length <= 0 || name.length > 15) {
                errorsArray.push(incorrectValues);
                resultCode = 1;
            }
            if (youtubeUrl.match(youtubeUrlRegExp) === null || youtubeUrl.length > 100) {
                errorsArray.push(incorrectFieldYoutubeUrl);
                resultCode = 1;
            }
            if (blogger) {
                blogger.name = name;
                blogger.youtubeUrl = youtubeUrl;
            }
            return {
                data: blogger,
                errorsMessages: errorsArray,
                resultCode: resultCode
            };
        });
    },
    deletedBloggerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                return false;
            }
            // delete from bloggers array
            const blogger = exports.bloggers.filter(v => v.id === id);
            if (exports.bloggers.filter(v => v.id === id) && exports.bloggers.indexOf(blogger[0]) !== -1) {
                const newV = exports.bloggers.indexOf(blogger[0]);
                exports.bloggers.splice(newV, 1);
                try {
                    // If the blogger is in the array, then we call the function in the post repository
                    // deletedAllPostsByBloggerId so that it deletes all posts with this bloggerId
                    yield (0, posts_repository_1.deletedAllPostsByBloggerId)(id);
                    // Checking the blogger in the deleted array, if it is not there, then push him there
                    if (exports.deletedBloggers.filter(v => v.id === id).length === 0) {
                        exports.deletedBloggers.push(blogger[0]);
                    }
                }
                catch (e) {
                    console.log("Error => function deletedAllPostsByBloggerId. " +
                        "Фунция сделана самостоятельно, не по заданию возможна ошибка при тестах.");
                }
            }
            return true;
        });
    }
};
//# sourceMappingURL=bloggers-repository.js.map