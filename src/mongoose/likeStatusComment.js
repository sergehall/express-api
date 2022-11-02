"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelLikeStatusCommentId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LikeStatusCommentIdSchema = new mongoose_1.default.Schema({
    commentId: {
        type: String,
        required: [true, 'commentId is required'],
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
exports.MyModelLikeStatusCommentId = mongoose_1.default.model("likeStatusComment", LikeStatusCommentIdSchema, 'LikeStatusCommentId');
//# sourceMappingURL=likeStatusComment.js.map