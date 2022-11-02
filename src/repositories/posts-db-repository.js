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
exports.PostsRepository = void 0;
const errorsMessages_1 = require("../middlewares/errorsMessages");
const uuid4_1 = __importDefault(require("uuid4"));
const BloggersSchemaModel_1 = require("../mongoose/BloggersSchemaModel");
const CommentsSchemaModel_1 = require("../mongoose/CommentsSchemaModel");
const PostsSchemaModel_1 = require("../mongoose/PostsSchemaModel");
const likeStatusPosts_1 = require("../mongoose/likeStatusPosts");
const ThreeLastLikesPost_1 = require("../mongoose/ThreeLastLikesPost");
const UsersAccountsSchemaModel_1 = require("../mongoose/UsersAccountsSchemaModel");
const IoCContainer_1 = require("../IoCContainer");
const BlogsSchemaModel_1 = require("../mongoose/BlogsSchemaModel");
class PostsRepository {
    findPosts(pageNumber, pageSize, title, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (title !== null) {
                filter = { title: { $regex: title } };
            }
            const startIndex = (pageNumber - 1) * pageSize;
            const result = yield PostsSchemaModel_1.MyModelPosts.find(filter, {
                _id: false,
                __v: false
            }).limit(pageSize).skip(startIndex).lean();
            yield IoCContainer_1.ioc.preparationPostsForReturn.preparationPostsForReturn(result, currentUser);
            const totalCount = yield PostsSchemaModel_1.MyModelPosts.countDocuments(filter);
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
    findPostsByBloggerId(bloggerId, pageNumber, pageSize, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (bloggerId) {
                filter = { bloggerId: bloggerId };
            }
            const startIndex = (pageNumber - 1) * pageSize;
            const result = yield PostsSchemaModel_1.MyModelPosts.find(filter, {
                _id: false,
                __v: false
            }).limit(pageSize).skip(startIndex).lean();
            yield IoCContainer_1.ioc.preparationPostsForReturn.preparationPostsForReturn(result, user);
            const totalCount = yield PostsSchemaModel_1.MyModelPosts.countDocuments(filter);
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
    createPost(title, shortDescription, content, blogId, addedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorsArray = [];
            const newPostId = (0, uuid4_1.default)().toString();
            const ReturnObjectPost = {
                data: {
                    id: "",
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    blogName: "",
                    addedAt: addedAt,
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: []
                    }
                },
                errorsMessages: [],
                resultCode: 1
            };
            const foundBlogId = yield BlogsSchemaModel_1.MyModelBlogs.findOne({ id: blogId });
            if (!foundBlogId) {
                errorsArray.push(errorsMessages_1.notFoundBlogId);
                return Object.assign(Object.assign({}, ReturnObjectPost), { errorsMessages: errorsArray });
            }
            const newPost = Object.assign(Object.assign({}, ReturnObjectPost.data), { id: newPostId, title: title, shortDescription: shortDescription, content: content, blogId: blogId, blogName: foundBlogId.name, addedAt: addedAt, extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                    newestLikes: []
                } });
            try {
                const createNewPost = yield PostsSchemaModel_1.MyModelPosts.create(newPost);
                const creteNewPostInCommentDB = yield CommentsSchemaModel_1.MyModelComments.create({
                    postId: newPostId,
                    allComments: []
                });
                if (!createNewPost) {
                    errorsArray.push(errorsMessages_1.MongoHasNotUpdated);
                    return Object.assign(Object.assign({}, ReturnObjectPost), { errorsMessages: errorsArray });
                }
                return {
                    data: createNewPost,
                    errorsMessages: errorsArray,
                    resultCode: 0
                };
            }
            catch (e) {
                console.log(e);
                return Object.assign(Object.assign({}, ReturnObjectPost), { errorsMessages: errorsArray });
            }
        });
    }
    createNewCommentByPostId(postId, content, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let errorsArray = [];
                const newCommentId = (0, uuid4_1.default)().toString();
                const createdAt = new Date().toISOString();
                const newComment = {
                    id: newCommentId,
                    content: content,
                    userId: user.accountData.id,
                    userLogin: user.accountData.login,
                    createdAt: createdAt,
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None"
                    }
                };
                const findOneAndUpdateComment = yield CommentsSchemaModel_1.MyModelComments.findOneAndUpdate({ postId: postId }, {
                    $push: { allComments: newComment }
                });
                if (!findOneAndUpdateComment) {
                    errorsArray.push(errorsMessages_1.notFoundPostId);
                    return {
                        data: null,
                        errorsMessages: errorsArray,
                        resultCode: 1
                    };
                }
                return {
                    data: newComment,
                    errorsMessages: errorsArray,
                    resultCode: 0
                };
            }
            catch (e) {
                console.log(e);
                return {
                    data: null,
                    errorsMessages: [{
                            message: 'catch error in createNewCommentByPostId',
                            field: "error"
                        }],
                    resultCode: 1
                };
            }
        });
    }
    getPostById(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield PostsSchemaModel_1.MyModelPosts.findOne({ id: id }, {
                _id: false,
                __v: false
            }).lean();
            if (!post) {
                return null;
            }
            const result = [post];
            yield IoCContainer_1.ioc.preparationPostsForReturn.preparationPostsForReturn(result, user);
            return post;
        });
    }
    getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { postId: postId };
            let foundPost = yield PostsSchemaModel_1.MyModelPosts.findOne({ id: postId }).lean();
            if (foundPost === null) {
                return {
                    pagesCount: 0,
                    page: 0,
                    pageSize: 0,
                    totalCount: 0,
                    items: []
                };
            }
            let totalCount = yield CommentsSchemaModel_1.MyModelComments.findOne(filter)
                .then(comments => comments === null || comments === void 0 ? void 0 : comments.allComments.length);
            if (!totalCount) {
                totalCount = 0;
            }
            const pagesCount = Math.ceil(totalCount / pageSize);
            let desc = 1;
            let asc = -1;
            let field = "createdAt";
            if (sortDirection === "asc") {
                desc = -1;
                asc = 1;
            }
            if (sortBy === "userId" || sortBy === "userLogin" || sortBy === "content") {
                field = sortBy;
            }
            // sort array comments
            function byField(field, asc, desc) {
                return (a, b) => a[field] > b[field] ? asc : desc;
            }
            let comments = yield CommentsSchemaModel_1.MyModelComments.findOne(filter, {
                _id: false, 'allComments._id': false
            }).lean()
                .then(comments => comments === null || comments === void 0 ? void 0 : comments.allComments.sort(byField(field, asc, desc)));
            if (!comments) {
                comments = [];
            }
            let startIndex = (pageNumber - 1) * pageSize;
            const commentsSlice = comments.slice(startIndex, startIndex + pageSize);
            const filledComments = yield IoCContainer_1.ioc.preparationComments.preparationCommentsForReturn(commentsSlice, user);
            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: filledComments
            };
        });
    }
    updatePostById(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchPost = yield PostsSchemaModel_1.MyModelPosts.findOne({ id: id }, {
                _id: false,
                __v: false,
            }).lean();
            const searchBlogger = yield BloggersSchemaModel_1.MyModelBloggers.findOne({ id: blogId });
            const errorsArray = [];
            const createdAt = (new Date()).toISOString();
            if (!searchPost) {
                errorsArray.push(errorsMessages_1.notFoundPostId);
            }
            if (!searchBlogger) {
                errorsArray.push(errorsMessages_1.notFoundBloggerId);
            }
            if (searchPost && searchBlogger) {
                const result = yield PostsSchemaModel_1.MyModelPosts.updateOne({ id: id }, {
                    $set: {
                        id: id,
                        title: title,
                        shortDescription: shortDescription,
                        content: content,
                        blogId: blogId,
                        blogName: searchBlogger.name,
                    }
                }).lean();
                if (result.matchedCount === 0) {
                    errorsArray.push(errorsMessages_1.MongoHasNotUpdated);
                }
            }
            if (errorsArray.length !== 0 || !searchPost) {
                return {
                    data: {
                        id: "",
                        title: title,
                        shortDescription: shortDescription,
                        content: content,
                        blogId: blogId,
                        blogName: "",
                        addedAt: createdAt,
                        extendedLikesInfo: {
                            likesCount: 0,
                            dislikesCount: 0,
                            myStatus: "",
                            newestLikes: []
                        }
                    },
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            const foundUpdatedPost = yield PostsSchemaModel_1.MyModelPosts.findOne({ id: id }, {
                _id: false,
            }).lean();
            if (foundUpdatedPost === null) {
                return {
                    data: {
                        id: "",
                        title: title,
                        shortDescription: shortDescription,
                        content: content,
                        blogId: blogId,
                        blogName: "",
                        addedAt: createdAt,
                        extendedLikesInfo: {
                            likesCount: 0,
                            dislikesCount: 0,
                            myStatus: "",
                            newestLikes: []
                        }
                    },
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            return {
                data: foundUpdatedPost,
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield PostsSchemaModel_1.MyModelPosts.deleteOne({ id: id });
            // deleted all comments
            yield CommentsSchemaModel_1.MyModelComments.deleteOne({ postId: id });
            return result.deletedCount === 1;
        });
    }
    deletedAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield PostsSchemaModel_1.MyModelPosts.deleteMany({});
            return result.acknowledged;
        });
    }
    changeLikeStatusPost(user, postId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = user.accountData.id;
            const createdAt = (new Date()).toISOString();
            const newLikeStatus = {
                postId: postId,
                userId: userId,
                likeStatus: likeStatus,
                createdAt: createdAt,
            };
            try {
                const findPostInPostDB = yield PostsSchemaModel_1.MyModelPosts.findOne({ id: postId });
                if (!findPostInPostDB) {
                    return false;
                }
                const currentLikeStatus = yield likeStatusPosts_1.MyModelLikeStatusPostsId.findOne({
                    $and: [{ postId: postId },
                        { userId: userId }]
                }).lean();
                if (!currentLikeStatus) {
                    yield likeStatusPosts_1.MyModelLikeStatusPostsId.create(newLikeStatus);
                }
                const postInThreeLastLikes = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOne({
                    $and: [{ postId: postId },
                        { "threeNewestLikes.userId": userId }]
                }).lean();
                if (currentLikeStatus
                    && currentLikeStatus.likeStatus === "Like"
                    && likeStatus === "Like"
                    && postInThreeLastLikes) {
                    return true;
                }
                if (likeStatus === 'Like') {
                    const newestLikeToThreeLastLikes = {
                        addedAt: createdAt,
                        userId: user.accountData.id,
                        login: user.accountData.login
                    };
                    const updateCurrentLikeInLikeStatusPosts = yield likeStatusPosts_1.MyModelLikeStatusPostsId.findOneAndUpdate({ postId: postId, userId: userId }, { likeStatus: likeStatus }).lean();
                    const checkPostLastLikes = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOne({ postId: postId }).lean();
                    if (!checkPostLastLikes) {
                        const createThreeLastLikesArray = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.create({
                            postId: postId,
                            threeNewestLikes: [newestLikeToThreeLastLikes]
                        });
                        return true;
                    }
                    if (checkPostLastLikes && !postInThreeLastLikes && checkPostLastLikes.threeNewestLikes.length < 3) {
                        const result = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOneAndUpdate({ postId: postId }, { $push: { "threeNewestLikes": newestLikeToThreeLastLikes } });
                        return true;
                    }
                    else if (checkPostLastLikes && !postInThreeLastLikes && checkPostLastLikes.threeNewestLikes.length === 3) {
                        const sortArray = checkPostLastLikes.threeNewestLikes.sort(function (a, b) {
                            const addedAtA = a.addedAt;
                            const addedAtB = b.addedAt;
                            if (addedAtA < addedAtB) //sort the rows in ascending order
                                return -1;
                            if (addedAtA > addedAtB)
                                return 1;
                            return 0;
                        });
                        sortArray.push(newestLikeToThreeLastLikes);
                        const result = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOneAndUpdate({ postId: postId }, { $set: { "threeNewestLikes": sortArray.slice(1) } });
                        return true;
                    }
                    return false;
                }
                // if likeStatus: Dislike or None
                const updateLikeStatus = yield likeStatusPosts_1.MyModelLikeStatusPostsId.findOneAndUpdate({
                    $and: [{ postId: postId },
                        { userId: userId }]
                }, { likeStatus: likeStatus }).lean();
                const findLikeInThreeLast = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOne({
                    $and: [{ postId: postId },
                        { "threeNewestLikes.userId": userId }]
                }).lean();
                if (!findLikeInThreeLast) {
                    return true;
                }
                // get array likes by postId
                let findNewestLikeArray = yield likeStatusPosts_1.MyModelLikeStatusPostsId.find({
                    $and: [{ postId: postId },
                        { likeStatus: "Like" }]
                }).sort(createdAt).lean();
                function findLikeNoInThreeLast(findNewestLikeArray) {
                    return __awaiter(this, void 0, void 0, function* () {
                        while (true) {
                            const newestLike = findNewestLikeArray.pop();
                            if (newestLike === undefined) {
                                break;
                            }
                            const likeNoInThreeLast = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOne({ "threeNewestLikes.userId": newestLike.userId }).lean();
                            if (!likeNoInThreeLast) {
                                return newestLike;
                            }
                        }
                    });
                }
                const findNewestLike = yield findLikeNoInThreeLast(findNewestLikeArray);
                if (!findNewestLikeArray && findLikeInThreeLast || !findNewestLike) {
                    const removeLikeFromThreeLastLikes = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOne({
                        $and: [{ postId: postId },
                            { "threeNewestLikes.userId": userId }]
                    }).lean();
                    if (removeLikeFromThreeLastLikes) {
                        const delLikesFromThreeLast = removeLikeFromThreeLastLikes.threeNewestLikes.filter(i => i.userId !== userId);
                        const updateThreeLastLikes = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOneAndUpdate({ postId: postId }, { threeNewestLikes: delLikesFromThreeLast });
                        return true;
                    }
                }
                const gettingLoginNewestLike = yield UsersAccountsSchemaModel_1.MyModelUserAccount.findOne({ "accountData.id": findNewestLike.userId }).lean();
                if (!gettingLoginNewestLike) {
                    return false;
                }
                const updatedThreeLastLikes = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.updateOne({
                    "threeNewestLikes.userId": userId
                }, {
                    "threeNewestLikes.$.addedAt": findNewestLike.createdAt,
                    "threeNewestLikes.$.userId": findNewestLike.userId,
                    "threeNewestLikes.$.login": gettingLoginNewestLike.accountData.login
                });
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
}
exports.PostsRepository = PostsRepository;
//# sourceMappingURL=posts-db-repository.js.map