"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: [true, 'Id is required'],
        unique: true
    },
    login: {
        type: String,
        required: [true, 'login is required'],
        unique: true
    },
    email: {
        type: String,
    },
    passwordHash: {
        type: String,
        required: [true, 'passwordHash is required']
    },
    passwordSalt: {
        type: String,
        required: [true, 'passwordSalt is required']
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required']
    }
});
exports.MyModelUser = mongoose_1.default.model("userSchema", UserSchema, "Users");
//# sourceMappingURL=UsersSchemaModel.js.map