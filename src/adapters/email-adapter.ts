import nodemailer from "nodemailer";
import {UserAccountDBType} from "../types/all_types";

const ck = require('ckey')

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ck.NODEMAILER_EMAIL,
    pass: ck.NODEMAILER_APP_PASSWORD
  }
});


export const emailAdapter = {

  async sendEmail(email: string, subject: string, text: string) {
    return await transporter.sendMail({
      from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
      to: email,
      subject: subject,
      html: text
    })
  },

  async sendEmailConfirmationMessage(user: UserAccountDBType) {
    return await transporter.sendMail({
      from: 'Email confirmation message <ck.NODEMAILER_EMAIL>',
      to: user.accountData.email,
      subject: "Email confirmation",
      html: `
      <h1 style="color: dimgrey">Click on the link below to confirm your email address</h1>
       <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/confirm-registration?Code=${user.emailConfirmation.confirmationCode}\"> Push to confirm. /confirm-code?Code= </a></div>
      <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/confirm-code/${user.emailConfirmation.confirmationCode}\"> Push to confirm. /confirm-code/code </a></div>
      <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/registration-email-resend?Code=${user.emailConfirmation.confirmationCode}\"> Push to /registration-email-resending </a></div>
      `
    })
  },

  async sendEmailRecoveryPassword(user: object, token: string) {
    return await transporter.sendMail({
      from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
      to: user.toString(),
      subject: "Recover password",
      html: `
        Hello, to recover your password, please enter the following link:
        http://localhost:5000/recovery/${token}
        `
    })
  }
};