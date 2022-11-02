"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelBlackListIP = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BlackListIPSchema = new mongoose_1.default.Schema({
    ip: {
        type: String,
        required: [true, 'ip is required'],
        default: ""
    },
    countTimes: {
        type: Array({
            createdAt: {
                type: String,
                required: [true, 'createdAt is required']
            }
        }),
        validate: (v) => Array.isArray(v)
    }
});
exports.MyModelBlackListIP = mongoose_1.default.model("blackListIP", BlackListIPSchema, 'BlackListIP');
//# sourceMappingURL=BlackListIPSchemaModel.js.map