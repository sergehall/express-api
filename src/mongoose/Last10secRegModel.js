"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModeLast10secReg = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UsersIPLast10secCollectionRegSchema = new mongoose_1.default.Schema({
    ip: {
        type: String,
        required: [true, 'ip is required']
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required']
    }
});
exports.MyModeLast10secReg = mongoose_1.default.model("usersIPLast10secCollectionReg", UsersIPLast10secCollectionRegSchema, "Last10secReg");
//# sourceMappingURL=Last10secRegModel.js.map