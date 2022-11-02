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
exports.EmailSender = void 0;
const IoCContainer_1 = require("../IoCContainer");
class EmailSender {
    sendAndDeleteConfirmationCode() {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const emailAndCode = yield IoCContainer_1.ioc.emailsToSentRepository.findEmailByOldestDate();
                if (emailAndCode !== null) {
                    yield IoCContainer_1.ioc.emailAdapter.sendEmailConfirmationMessage(emailAndCode);
                    yield IoCContainer_1.ioc.emailsToSentRepository.deleteInsertedEmailAfterSent(emailAndCode);
                }
                yield IoCContainer_1.ioc.emailSender.sendAndDeleteConfirmationCode();
            }), 5000);
        });
    }
    sendAndDeleteRecoveryCode() {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const emailAndCode = yield IoCContainer_1.ioc.emailsToSentRepository.findEmailByOldestDateRecoveryCode();
                if (emailAndCode !== null) {
                    yield IoCContainer_1.ioc.emailAdapter.sendEmailRecoveryCode(emailAndCode);
                    yield IoCContainer_1.ioc.emailsToSentRepository.deleteInsertedEmailAfterSentRecoveryCode(emailAndCode);
                }
                yield IoCContainer_1.ioc.emailSender.sendAndDeleteRecoveryCode();
            }), 5000);
        });
    }
}
exports.EmailSender = EmailSender;
//# sourceMappingURL=emailSender.js.map