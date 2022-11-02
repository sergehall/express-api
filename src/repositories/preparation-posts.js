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
exports.PreparationPosts = void 0;
const likeStatusPosts_1 = require("../mongoose/likeStatusPosts");
const ThreeLastLikesPost_1 = require("../mongoose/ThreeLastLikesPost");
class PreparationPosts {
    preparationPostsForReturn(myArray, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i in myArray) {
                const id = myArray[i].id;
                const post = myArray[i];
                post.extendedLikesInfo.likesCount = yield likeStatusPosts_1.MyModelLikeStatusPostsId.countDocuments({
                    $and: [{ postId: id },
                        { likeStatus: "Like" }]
                }).lean();
                // getting dislikes and count
                post.extendedLikesInfo.dislikesCount = yield likeStatusPosts_1.MyModelLikeStatusPostsId.countDocuments({
                    $and: [{ postId: id },
                        { likeStatus: "Dislike" }]
                }).lean();
                // getting the status of the post owner
                post.extendedLikesInfo.myStatus = "None";
                if (currentUser) {
                    const statusPostOwner = yield likeStatusPosts_1.MyModelLikeStatusPostsId.findOne({
                        $and: [{ postId: id },
                            { userId: currentUser.accountData.id }]
                    }).lean();
                    if (statusPostOwner) {
                        post.extendedLikesInfo.myStatus = statusPostOwner.likeStatus;
                    }
                }
                // getting 3 last likes
                const lastThreeLikesArray = yield ThreeLastLikesPost_1.MyModelThreeLastLikesPost.findOne({ postId: id }, {
                    _id: false,
                    __v: false
                }).lean();
                if (lastThreeLikesArray && post) {
                    const withoutObjId = [];
                    for (let i of lastThreeLikesArray.threeNewestLikes) {
                        withoutObjId.push({
                            addedAt: i.addedAt,
                            userId: i.userId,
                            login: i.login
                        });
                    }
                    // NewestLikes sorted in descending
                    post.extendedLikesInfo.newestLikes = withoutObjId.sort(function (a, b) {
                        if (a.addedAt < b.addedAt) {
                            return 1;
                        }
                        if (a.addedAt > b.addedAt) {
                            return -1;
                        }
                        return 0;
                    });
                }
            }
        });
    }
}
exports.PreparationPosts = PreparationPosts;
//# sourceMappingURL=preparation-posts.js.map