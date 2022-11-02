"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelBlogPosts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BlogPostsSchema = new mongoose_1.default.Schema({
    blogId: {
        type: String,
        required: [true, 'blogId is required']
    },
    allPosts: {
        type: Array({
            id: {
                type: String,
                required: [true, 'id is required']
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
            createdAt: {
                type: String,
                required: [true, 'createdAt is required']
            }
        })
    }
});
exports.MyModelBlogPosts = mongoose_1.default.model("blogPosts", BlogPostsSchema, 'BlogPosts');
//# sourceMappingURL=PostsBlogSchemaModel.js.map