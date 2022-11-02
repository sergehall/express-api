"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelDevicesSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DevicesSchemaSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: [true, 'userId is required']
    },
    ip: {
        type: String,
        required: [true, 'ip is required']
    },
    title: {
        type: String,
        required: [true, 'title is required']
    },
    lastActiveDate: {
        type: String,
        required: [true, 'lastActiveDate is required']
    },
    expirationDate: {
        type: String,
        required: [true, 'expirationDate is required']
    },
    deviceId: {
        type: String,
        required: [false, 'deviceId is not required'],
        unique: true
    }
});
exports.MyModelDevicesSchema = mongoose_1.default.model("devicesSchema", DevicesSchemaSchema, "sessionDevices");
//# sourceMappingURL=DevicesSchemaModel.js.map