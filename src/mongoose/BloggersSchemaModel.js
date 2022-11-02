"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelBloggers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BloggerSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: [true, 'id is required'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'name is required']
    },
    youtubeUrl: {
        type: String,
        required: [true, 'youtubeUrl is required']
    }
});
exports.MyModelBloggers = mongoose_1.default.model("bloggers", BloggerSchema, 'Bloggers');
//# sourceMappingURL=BloggersSchemaModel.js.map