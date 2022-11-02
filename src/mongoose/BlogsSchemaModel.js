"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelBlogs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BlogsSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: [true, 'id is required']
    },
    name: {
        type: String,
        required: [true, 'name is required']
    },
    youtubeUrl: {
        type: String,
        required: [true, 'youtubeUrl is required']
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required']
    }
});
exports.MyModelBlogs = mongoose_1.default.model("blogs", BlogsSchema, 'Blogs');
//# sourceMappingURL=BlogsSchemaModel.js.map