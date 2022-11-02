"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelThreeLastLikesPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ThreeLastLikesPostSchema = new mongoose_1.default.Schema({
    postId: {
        type: String,
        required: [true, 'postId is required'],
    },
    threeNewestLikes: {
        type: Array({
            addedAt: {
                type: String,
                required: [true, 'addedAt is required']
            },
            userId: {
                type: String,
                required: [true, 'userId is required']
            },
            login: {
                type: String,
                required: [true, 'login is required']
            }
        }),
        validate: (v) => Array.isArray(v)
    }
});
exports.MyModelThreeLastLikesPost = mongoose_1.default.model("threeLastLikesPost", ThreeLastLikesPostSchema, 'ThreeLastLikesPost');
//# sourceMappingURL=ThreeLastLikesPost.js.map