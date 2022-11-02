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
exports.PreparationComments = void 0;
const likeStatusComment_1 = require("../mongoose/likeStatusComment");
class PreparationComments {
    preparationCommentsForReturn(commentsArray, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const filledCommentsArray = [];
            for (let i in commentsArray) {
                const comment = commentsArray[i];
                const commentId = commentsArray[i].id;
                const filterCommentId = { commentId: commentId };
                let currentLikeStatus = { likeStatus: "None" };
                if (currentUser && comment.userId === currentUser.accountData.id) {
                    const checkCurrentLikeStatus = yield likeStatusComment_1.MyModelLikeStatusCommentId.findOne({
                        $and: [
                            { userId: currentUser.accountData.id },
                            filterCommentId
                        ]
                    });
                    if (checkCurrentLikeStatus) {
                        currentLikeStatus = { likeStatus: checkCurrentLikeStatus.likeStatus };
                    }
                }
                const countLikes = yield likeStatusComment_1.MyModelLikeStatusCommentId.countDocuments({
                    $and: [{ commentId: commentId },
                        { likeStatus: "Like" }]
                }).lean();
                const countDislike = yield likeStatusComment_1.MyModelLikeStatusCommentId.countDocuments({
                    $and: [{ commentId: commentId },
                        { likeStatus: "Dislike" }]
                }).lean();
                filledCommentsArray.push({
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: countLikes,
                        dislikesCount: countDislike,
                        myStatus: currentLikeStatus.likeStatus,
                    }
                });
            }
            return filledCommentsArray;
        });
    }
}
exports.PreparationComments = PreparationComments;
//# sourceMappingURL=preparation-comments.js.map