"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelAllDeletedPosts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AllDeletedPostsSchema = new mongoose_1.default.Schema({
    bloggerIdKey: {
        type: String,
        required: true
    },
    posts: {
        type: Array({
            id: String || null,
            title: String,
            shortDescription: String,
            content: String,
            bloggerId: String,
            bloggerName: String,
        }),
        validate: (v) => Array.isArray(v)
    }
});
exports.MyModelAllDeletedPosts = mongoose_1.default.model("allDeletedPosts", AllDeletedPostsSchema, 'AllDeletedPosts');
//# sourceMappingURL=AllDeletedPostsSchemaModel.js.map