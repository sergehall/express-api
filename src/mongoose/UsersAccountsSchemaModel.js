"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyModelUserAccount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserAccountSchema = new mongoose_1.default.Schema({
    accountData: {
        id: {
            type: String,
            required: [true, 'Id is required'],
        },
        login: {
            type: String,
            required: [true, 'login is required'],
            unique: true
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true
        },
        passwordHash: {
            type: String,
            required: [true, 'passwordHash is required']
        },
        passwordSalt: {
            type: String,
            required: [false, 'passwordSalt is not required']
        },
        createdAt: {
            type: String,
            required: [true, 'createdAt is required']
        },
    },
    emailConfirmation: {
        confirmationCode: {
            type: String,
            required: [true, 'confirmationCode is required']
        },
        expirationDate: {
            type: String,
            required: [true, 'expirationDate is required']
        },
        isConfirmed: Boolean,
        sentEmail: {
            type: Array({
                sendTime: {
                    type: String,
                    required: [true, 'sendTime is required']
                }
            }),
            validate: (v) => Array.isArray(v)
        }
    },
    registrationData: {
        type: Array({
            ip: {
                type: String,
                default: null
            },
            createdAt: {
                type: String,
                required: [true, 'createdAt is required']
            }
        }),
        validate: (v) => Array.isArray(v)
    }
});
exports.MyModelUserAccount = mongoose_1.default.model("userAccountSchema", UserAccountSchema, "UsersAccount");
//# sourceMappingURL=UsersAccountsSchemaModel.js.map