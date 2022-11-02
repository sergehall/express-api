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
exports.CommentsRepository = void 0;
const errorsMessages_1 = require("../middlewares/errorsMessages");
const CommentsSchemaModel_1 = require("../mongoose/CommentsSchemaModel");
const likeStatusComment_1 = require("../mongoose/likeStatusComment");
const IoCContainer_1 = require("../IoCContainer");
class CommentsRepository {
    findCommentInDB(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return CommentsSchemaModel_1.MyModelComments.findOne(filter);
        });
    }
    getCommentById(commentId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorsArray = [];
            const filter = { "allComments.id": commentId };
            const foundPostWithComments = yield CommentsSchemaModel_1.MyModelComments.findOne(filter, {
                _id: false,
                "allComments._id": false
            }).lean();
            if (!foundPostWithComments) {
                errorsArray.push(errorsMessages_1.notFoundCommentId);
                return {
                    data: null,
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            const commentArray = [foundPostWithComments.allComments.filter(i => i.id === commentId)[0]];
            const commentFiledLikesInfo = yield IoCContainer_1.ioc.preparationComments.preparationCommentsForReturn(commentArray, currentUser);
            return {
                data: commentFiledLikesInfo[0],
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    updateCommentById(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorsArray = [];
            const filterToUpdate = { "allComments.id": commentId };
            let resultCode = 0;
            const result = yield CommentsSchemaModel_1.MyModelComments.updateOne(filterToUpdate, { $set: { "allComments.$.content": content } });
            if (result.modifiedCount === 0 && result.matchedCount == 0) {
                errorsArray.push(errorsMessages_1.MongoHasNotUpdated);
            }
            if (errorsArray.length !== 0) {
                resultCode = 1;
            }
            return {
                data: null,
                errorsMessages: errorsArray,
                resultCode: resultCode
            };
        });
    }
    deletedCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorsArray = [];
            const filterToDelete = { "allComments.id": commentId };
            const resultDeleted = yield CommentsSchemaModel_1.MyModelComments.findOneAndUpdate(filterToDelete, {
                $pull: {
                    allComments: {
                        id: commentId
                    }
                }
            });
            if (!resultDeleted) {
                errorsArray.push(errorsMessages_1.notDeletedComment);
                return {
                    data: null,
                    errorsMessages: errorsArray,
                    resultCode: 1
                };
            }
            return {
                data: null,
                errorsMessages: errorsArray,
                resultCode: 0
            };
        });
    }
    changeLikeStatusComment(user, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = user.accountData.id;
            const createdAt = new Date().toISOString();
            const newLikeStatus = {
                commentId: commentId,
                userId: userId,
                likeStatus: likeStatus,
                createdAt: createdAt,
            };
            try {
                const filterToUpdate = { "allComments.id": commentId };
                const result = yield CommentsSchemaModel_1.MyModelComments.findOneAndUpdate(filterToUpdate, { $set: { "allComments.likeStatus": likeStatus } }, { upsert: true });
                if (!result) {
                    return false;
                }
                const currentLikeStatus = yield likeStatusComment_1.MyModelLikeStatusCommentId.findOneAndUpdate({
                    $and: [{ commentId: commentId },
                        { userId: userId }]
                }, { $set: newLikeStatus }, { upsert: true });
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
}
exports.CommentsRepository = CommentsRepository;
//# sourceMappingURL=comments-db-repository.js.map