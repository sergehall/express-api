"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelFeedbacks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FeedbacksSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: [true, 'id is required'],
        unique: true
    },
    allFeedbacks: {
        type: Array({
            commentId: {
                type: String,
                required: [true, 'commentId from Feedback is required']
            },
            comment: {
                type: String,
                required: [true, 'comment from Feedback is required']
            }
        }),
        validate: (v) => Array.isArray(v)
    }
});
exports.MyModelFeedbacks = mongoose_1.default.model("feedbacks", FeedbacksSchema, 'Feedbacks');
//# sourceMappingURL=FeedbacksSchemaModel.js.map