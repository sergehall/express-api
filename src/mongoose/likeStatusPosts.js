"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelLikeStatusPostsId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LikeStatusPostsIdSchema = new mongoose_1.default.Schema({
    postId: {
        type: String,
        required: [true, 'postId is required'],
    },
    userId: {
        type: String,
        required: [true, 'userId is required'],
    },
    likeStatus: {
        type: String,
        required: [true, 'likeStatus is required']
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required']
    }
});
exports.MyModelLikeStatusPostsId = mongoose_1.default.model("likeStatusPosts", LikeStatusPostsIdSchema, 'LikeStatusPostsId');
//# sourceMappingURL=likeStatusPosts.js.map