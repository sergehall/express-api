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
      Click on the link and confirm your e-mail:
      https://it-express-api.herokuapp.com/auth/confirm-code/${user.emailConfirmation.confirmationCode}
      `
    })
  },

  async sendEmailRecoveryPassword(user: object, token: string) {
    return await transporter.sendMail({
      from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
      to: user.toString(),
      subject: "Recover password",
      html: `
        Hello, to recover your password, please enter the following link::
        http://localhost:5000/recovery/${token}
        `
    })
  }
};