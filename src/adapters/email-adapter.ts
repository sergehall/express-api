import nodemailer from "nodemailer";
import {
  EmailConfirmCodeType,
  EmailRecoveryCodeType,
  UserType
} from "../types/types";

const ck = require('ckey')


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ck.NODEMAILER_EMAIL,
    pass: ck.NODEMAILER_APP_PASSWORD
  }
});


export class EmailsAdapter {

  async sendCodeByRegistration(emailAndCode: EmailConfirmCodeType) {
    return await transporter.sendMail({
      from: 'Email confirmation message <ck.NODEMAILER_EMAIL>',
      to: emailAndCode.email,
      subject: "Email confirmation",
      html: `
      <h1 style="color: dimgrey">Click on the link below to confirm your email address</h1>
       <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/confirm-registration?code=${emailAndCode.confirmationCode}\"> Push to confirm. /registration-confirmation?code=${emailAndCode.confirmationCode}</a></div>
      `
    })
  }

  async sendCodeByPasswordRecovery(emailAndCode: EmailRecoveryCodeType) {
    return await transporter.sendMail({
      from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
      to: emailAndCode.email,
      subject: "Password recovery by recoveryCode",
      html:
        `
        <h1>Password recovery</h1>
          <p>To finish password recovery please follow the link below:
          <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/password-recovery?recoveryCode=${emailAndCode.recoveryCode}\"> Push for recovery password </a></div>
        </p>
        `
    })
  }

  async sendCodeByRecoveryPassword(user: UserType, token: string) {
    return await transporter.sendMail({
      from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
      to: user.accountData.email,
      subject: "Recover password",
      html: `
        Hello, to recover your password, please enter the following link:
        <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/resend-registration-email?code=${token}\"> сode </a></div>
        `
    })
  }

  async sendEmail(email: string, subject: string, text: string) {
    return await transporter.sendMail({
      from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
      to: email,
      subject: subject,
      html: text
    })
  }
}