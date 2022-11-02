"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelComments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentsSchema = new mongoose_1.default.Schema({
    postId: {
        type: String,
        required: [true, 'postId is required']
    },
    allComments: {
        type: Array({
            id: {
                type: String,
                required: [true, 'id is required']
            },
            content: {
                type: String,
                required: [true, 'content is required']
            },
            userId: {
                type: String,
                required: [true, 'userId is required']
            },
            userLogin: {
                type: String,
                required: [true, 'userLogin is required']
            },
            createdAt: {
                type: String,
                required: [true, 'createdAt is required']
            },
            likesInfo: {
                likesCount: {
                    type: Number,
                    required: [true, 'likesInfo is required']
                },
                dislikesCount: {
                    type: Number,
                    required: [true, 'dislikesCount is required']
                },
                myStatus: {
                    type: String,
                    required: [true, 'myStatus is required']
                }
            }
        }),
        validate: (v) => Array.isArray(v)
    }
});
exports.MyModelComments = mongoose_1.default.model("comments", CommentsSchema, 'Comments');
//# sourceMappingURL=CommentsSchemaModel.js.map