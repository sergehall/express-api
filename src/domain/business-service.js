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
exports.businessService = void 0;
const email_managers_1 = require("../managers/email-managers");
exports.businessService = {
    doSendEmailSimple(email, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield email_managers_1.emailManagers.doSendEmailSimple(email, subject, text);
        });
    },
    sendEmailRecoveryPassword(user, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // save to repository
            // get user from repository
            yield email_managers_1.emailManagers.sendEmailRecoveryPassword(user, token);
        });
    },
    doSomethingElse() {
        return __awaiter(this, void 0, void 0, function* () {
            // save to repository
            // get user from repository
            // do something with user sent or received
        });
    }
};
//# sourceMappingURL=business-service.js.map