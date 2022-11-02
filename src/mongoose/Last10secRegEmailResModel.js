"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModeLast10secRedEmailRes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UsersIPLast10secCollectionRegEmailResSchema = new mongoose_1.default.Schema({
    ip: {
        type: String,
        required: [true, 'ip is required']
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required']
    }
});
exports.MyModeLast10secRedEmailRes = mongoose_1.default.model("usersIPLast10secCollectionRegEmailResSchema", UsersIPLast10secCollectionRegEmailResSchema, "Last10secRedEmailRes");
//# sourceMappingURL=Last10secRegEmailResModel.js.map