"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelBlackListRefreshTokenJWT = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BlackListRefreshTokenJWTSchema = new mongoose_1.default.Schema({
    refreshToken: {
        type: String,
        required: [true, 'refreshToken is required'],
        unique: true
    }
});
exports.MyModelBlackListRefreshTokenJWT = mongoose_1.default.model("blackListRefreshToken", BlackListRefreshTokenJWTSchema, "BlackListRefreshTokens");
//# sourceMappingURL=BlackListRefreshTokenJWTModel.js.map