"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsToSentRepository = void 0;
const EmailsToSentSchemaModel_1 = require("../mongoose/EmailsToSentSchemaModel");
const EmailsToSentRecoveryCodeShemaModel_1 = require("../mongoose/EmailsToSentRecoveryCodeShemaModel");
class EmailsToSentRepository {
    insertEmailToDB(emailAndCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOneAndReplaceData = yield EmailsToSentSchemaModel_1.MyModelEmailsToSent.findOneAndReplace({ email: emailAndCode.email }, {
                email: emailAndCode.email,
                code: emailAndCode.confirmationCode,
                createdAt: emailAndCode.createdAt
            }, { upsert: true });
            return findOneAndReplaceData !== null;
        });
    }
    findEmailByOldestDate() {
        return __awaiter(this, void 0, void 0, function* () {
            const findData = yield EmailsToSentSchemaModel_1.MyModelEmailsToSent.find({}).sort({ createdAt: 1 });
            if (findData.length === 0) {
                return null;
            }
            return findData[0];
        });
    }
    deleteInsertedEmailAfterSent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (data.email) {
                filter = { email: data.email };
            }
            const result = yield EmailsToSentSchemaModel_1.MyModelEmailsToSent.deleteOne(filter);
            return result.acknowledged && result.deletedCount === 1;
        });
    }
    insertEmailToRecoveryCodesDB(emailAndCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOneAndReplaceData = yield EmailsToSentRecoveryCodeShemaModel_1.MyModelEmailsToSentRecoveryCode.findOneAndUpdate({ email: emailAndCode.email }, {
                $set: {
                    email: emailAndCode.email,
                    recoveryCode: emailAndCode.recoveryCode,
                    createdAt: emailAndCode.createdAt
                }
            }, { upsert: true });
            return findOneAndReplaceData !== null;
        });
    }
    findEmailByOldestDateRecoveryCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const findData = yield EmailsToSentRecoveryCodeShemaModel_1.MyModelEmailsToSentRecoveryCode.find({}, { _id: false }).sort({ createdAt: 1 });
            if (findData.length === 0) {
                return null;
            }
            return findData[0];
        });
    }
    deleteInsertedEmailAfterSentRecoveryCode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (data.email) {
                filter = { email: data.email };
            }
            const result = yield EmailsToSentRecoveryCodeShemaModel_1.MyModelEmailsToSentRecoveryCode.deleteOne(filter);
            return result.acknowledged && result.deletedCount === 1;
        });
    }
}
exports.EmailsToSentRepository = EmailsToSentRepository;
//# sourceMappingURL=emailsToSent-db-repository.js.map