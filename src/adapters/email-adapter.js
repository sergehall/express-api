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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ck = require('ckey');
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: ck.NODEMAILER_EMAIL,
        pass: ck.NODEMAILER_APP_PASSWORD
    }
});
class EmailAdapter {
    sendEmail(email, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transporter.sendMail({
                from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
                to: email,
                subject: subject,
                html: text
            });
        });
    }
    sendEmailConfirmationMessage(emailAndCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transporter.sendMail({
                from: 'Email confirmation message <ck.NODEMAILER_EMAIL>',
                to: emailAndCode.email,
                subject: "Email confirmation",
                html: `
      <h1 style="color: dimgrey">Click on the link below to confirm your email address</h1>
       <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/confirm-registration?code=${emailAndCode.confirmationCode}\"> Push to confirm. /registration-confirmation?code=${emailAndCode.confirmationCode}</a></div>
      <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/confirm-code/${emailAndCode.confirmationCode}\"> Push to confirm. /confirm-code/code </a></div>
      <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/resend-registration-email?code=${emailAndCode.confirmationCode}\"> Push to /resend-registration-emai?сode= </a></div>
      `
            });
        });
    }
    sendEmailRecoveryPassword(user, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transporter.sendMail({
                from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
                to: user.toString(),
                subject: "Recover password",
                html: `
        Hello, to recover your password, please enter the following link:
        http://localhost:5000/recovery/${token}
        `
            });
        });
    }
    sendEmailRecoveryCode(emailAndCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transporter.sendMail({
                from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
                to: emailAndCode.email,
                subject: "Recover password by code",
                html: `
        <h1>Password recovery</h1>
          <p>To finish password recovery please follow the link below:
          <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/password-recovery?recoveryCode=${emailAndCode.recoveryCode}\"> Push for recovery password </a></div>
        </p>
        `
            });
        });
    }
}
exports.EmailAdapter = EmailAdapter;
//# sourceMappingURL=email-adapter.js.map