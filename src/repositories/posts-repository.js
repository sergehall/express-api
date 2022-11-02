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
exports.postsRepository = exports.deletedAllPostsByBloggerId = exports.posts = void 0;
const bloggers_repository_1 = require("./bloggers-repository");
exports.posts = [
    {
        id: 1,
        title: 'Dimych post',
        shortDescription: 'Why do we use it?',
        content: "It is a long established fact that a reader will be distracted by the readable " +
            "content of a page when looking at its layout. The point of using Lorem Ipsum is that",
        bloggerId: 1,
        bloggerName: "Dimych"
    },
    {
        id: 2,
        title: 'Лекс post',
        shortDescription: 'Where can I get some?',
        content: "There are many variations of passages of Lorem Ipsum available, but the" +
            " majority have suffered alteration in some form, by injected humour,",
        bloggerId: 2,
        bloggerName: "Лекс"
    },
    {
        id: 3,
        title: 'Lex Fridman post',
        shortDescription: 'Where does it come from?',
        content: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots " +
            "in a piece of classical Latin literature from 45 BC, making",
        bloggerId: 3,
        bloggerName: "Lex Fridman"
    },
    {
        id: 4,
        title: 'Тимофей Хирьянов post',
        shortDescription: 'What is Lorem Ipsum?',
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        bloggerId: 4,
        bloggerName: "Тимофей Хирьянов"
    },
    {
        id: 5,
        title: 'SpaceX post',
        shortDescription: 'RESERVE YOUR RIDE ONLINE',
        content: "Find all the information you need to make a reservation online, everything from " +
            "port size to technical specifications to licensing information. Once your reservation " +
            "request is approved, SpaceX will provide you with a welcome package outlining next" +
            " steps for launch.",
        bloggerId: 5,
        bloggerName: "SpaceX"
    }
];
let arrayAllDeleted = [];
const incorrectValues = {
    message: "inputModel has incorrect values",
    field: "title, description or content"
};
const notFoundBloggerId = {
    message: "Invalid 'bloggerId': such blogger doesn't exist",
    field: "bloggerId"
};
const notFoundPostId = {
    message: "Invalid 'postId': such post doesn't exist",
    field: "postId"
};
const anEmptyObject = {
    message: "An empty object was received",
    field: "An empty object"
};
// The function is called when we delete a blogger by his id.
function deletedAllPostsByBloggerId(bloggerIdToDell) {
    return __awaiter(this, void 0, void 0, function* () {
        // Deleting all posts and adding them to a hidden deleted folder "arrayAllDeleted".
        const currentForDeletedPosts = exports.posts.filter(v => v.bloggerId === bloggerIdToDell);
        // If the blogger has no posts, the function returns null
        if (currentForDeletedPosts.length === 0) {
            return null;
        }
        const lengthPost = currentForDeletedPosts.length;
        if (arrayAllDeleted.length !== 0) {
            let foundBloggerId = false;
            for (let p = 0; p < arrayAllDeleted.length; p++) {
                if (bloggerIdToDell === arrayAllDeleted[p][0]) {
                    arrayAllDeleted[p][1] = [...arrayAllDeleted[p][1], ...currentForDeletedPosts];
                    foundBloggerId = true;
                }
            }
            if (!foundBloggerId) {
                arrayAllDeleted.push([currentForDeletedPosts[0].bloggerId, currentForDeletedPosts]);
            }
        }
        else {
            arrayAllDeleted.push([currentForDeletedPosts[0].bloggerId, currentForDeletedPosts]);
        }
        // We go through all the posts and if there is a bloggerID we delete this post
        for (let p = 0; p < lengthPost; p++) {
            const delPost = exports.posts.filter(v => v.bloggerId === bloggerIdToDell);
            if (exports.posts.find(v => v.bloggerId === bloggerIdToDell) && exports.posts.indexOf(delPost[0]) !== -1) {
                const newV = exports.posts.indexOf(delPost[0]);
                exports.posts.splice(newV, 1);
            }
        }
    });
}
exports.deletedAllPostsByBloggerId = deletedAllPostsByBloggerId;
exports.postsRepository = {
    findPosts(title) {
        return __awaiter(this, void 0, void 0, function* () {
            if (title) {
                return exports.posts.filter(p => p.title.toLowerCase().split("/")[exports.posts[0].title.toLowerCase().split("/").length - 1].indexOf(title.toLowerCase()) > -1);
            }
            else {
                return exports.posts;
            }
        });
    },
    createPost(title, shortDescription, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!title || !shortDescription || !content || !bloggerId) {
                return {
                    data: {
                        id: 0,
                        title: title,
                        shortDescription: shortDescription,
                        content: content,
                        bloggerId: bloggerId,
                        bloggerName: ""
                    },
                    errorsMessages: [anEmptyObject],
                    resultCode: 1
                };
            }
            let errorsArray = [];
            let resultCode = 0;
            let newPost = {
                id: 0,
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: ""
            };
            let foundBloggerId = bloggers_repository_1.bloggers.find(v => v.id === bloggerId);
            if (title.length > 30 || shortDescription.length > 100 || content.length > 1000) {
                errorsArray.push(incorrectValues);
                resultCode = 1;
            }
            if (!foundBloggerId) {
                errorsArray.push(notFoundBloggerId);
                resultCode = 1;
            }
            if (errorsArray.length === 0 && foundBloggerId) {
                // create new unique id
                let newId = +(new Date());
                let count = 0;
                while (count < 50 && exports.posts.find(i => i.id === newId)) {
                    newId = +(new Date());
                    count++;
                }
                newPost.id = newId;
                newPost.bloggerName = foundBloggerId.name;
                exports.posts.push(newPost);
            }
            return {
                data: newPost,
                errorsMessages: errorsArray,
                resultCode: resultCode
            };
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = exports.posts.find(v => v.id === id);
            if (foundPost) {
                return foundPost;
            }
            return false;
        });
    },
    updatePostById(id, title, shortDescription, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const searchPost = exports.posts.find(v => v.id === id);
            const searchBloggerId = bloggers_repository_1.bloggers.find(b => b.id === bloggerId);
            const errorsArray = [];
            if (title.length > 30 || shortDescription.length > 100 || content.length > 1000) {
                errorsArray.push(incorrectValues);
                resultCode = 1;
            }
            if (!searchPost) {
                errorsArray.push(notFoundPostId);
                return {
                    data: {
                        id: 0,
                        title: title,
                        shortDescription: shortDescription,
                        content: content,
                        bloggerId: bloggerId,
                        bloggerName: (searchBloggerId === null || searchBloggerId === void 0 ? void 0 : searchBloggerId.name) + ""
                    },
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            if (!searchBloggerId) {
                errorsArray.push(notFoundBloggerId);
                resultCode = 1;
            }
            if (searchPost && searchBloggerId) {
                searchPost.title = title;
                searchPost.shortDescription = shortDescription;
                searchPost.content = content;
                searchPost.bloggerId = bloggerId;
                searchPost.bloggerName = searchBloggerId.name;
            }
            return {
                data: searchPost,
                errorsMessages: errorsArray,
                resultCode: resultCode
            };
        });
    },
    deletedById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = exports.posts.filter(v => v.id === id);
            if (exports.posts.filter(v => v.id === id) && exports.posts.indexOf(post[0]) !== -1) {
                const newV = exports.posts.indexOf(post[0]);
                exports.posts.splice(newV, 1);
            }
            return true;
        });
    }
};
//# sourceMappingURL=posts-repository.js.map