"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelEmailsToSent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EmailsToSentSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, 'email is required']
    },
    confirmationCode: {
        type: String,
        required: [true, 'confirmationCode is required']
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required']
    }
});
exports.MyModelEmailsToSent = mongoose_1.default.model("emailsToSent", EmailsToSentSchema, 'EmailsToSent');
//# sourceMappingURL=EmailsToSentSchemaModel.js.map