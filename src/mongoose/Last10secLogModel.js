"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModeLast10secLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UsersIPLast10secCollectionLogSchema = new mongoose_1.default.Schema({
    ip: {
        type: String,
        required: [true, 'ip is required']
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required']
    }
});
exports.MyModeLast10secLog = mongoose_1.default.model("usersIPLast10secCollectionLogSchema", UsersIPLast10secCollectionLogSchema, "Last10secLog");
//# sourceMappingURL=Last10secLogModel.js.map