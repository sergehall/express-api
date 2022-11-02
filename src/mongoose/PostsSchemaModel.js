"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelPosts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PostsSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: [true, 'Id is required!!!'],
    },
    title: {
        type: String,
        required: [true, 'title is required']
    },
    shortDescription: {
        type: String,
        required: [true, 'shortDescription is required']
    },
    content: {
        type: String,
        required: [true, 'content is required']
    },
    blogId: {
        type: String,
        required: [true, 'blogId is required']
    },
    blogName: {
        type: String,
        required: [true, 'blogName is required']
    },
    addedAt: {
        type: String,
        required: [true, 'addedAt is required']
    },
    extendedLikesInfo: {
        likesCount: {
            type: String,
            required: [true, 'likesCount is required']
        },
        dislikesCount: {
            type: String,
            required: [true, 'dislikesCount is required']
        },
        myStatus: {
            type: String,
            required: [true, 'myStatus is required']
        },
        newestLikes: {
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
    }
});
exports.MyModelPosts = mongoose_1.default.model("posts", PostsSchema, 'Posts');
//# sourceMappingURL=PostsSchemaModel.js.map