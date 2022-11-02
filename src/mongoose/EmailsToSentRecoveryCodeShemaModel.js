"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelEmailsToSentRecoveryCode = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EmailsRecoveryCodeSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, 'Id is required'],
    },
    recoveryCode: {
        type: String,
        required: [true, 'Id is required'],
    },
    createdAt: {
        type: String,
        required: [true, 'Id is required'],
    }
});
exports.MyModelEmailsToSentRecoveryCode = mongoose_1.default.model("emailsToSentRecoveryCode", EmailsRecoveryCodeSchema, 'EmailsToSentRecoveryCode');
//# sourceMappingURL=EmailsToSentRecoveryCodeShemaModel.js.map