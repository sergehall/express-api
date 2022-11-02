"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModeRedLast10secNewPasswordReq = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NewPasswordReqSchema = new mongoose_1.default.Schema({
    ip: {
        type: String,
        required: [true, 'ip is required']
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required']
    }
});
exports.MyModeRedLast10secNewPasswordReq = mongoose_1.default.model("Last10secNewPasswordReqSchema", NewPasswordReqSchema, "Last10secNewPasswordReq");
//# sourceMappingURL=Last10secNewPassResModel.js.map