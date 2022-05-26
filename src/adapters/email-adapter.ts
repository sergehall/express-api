import nodemailer from "nodemailer";

const ck = require('ckey')

export const emailAdapter = {
  async sendEmail(email: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ck.NODEMAILER_EMAIL,
        pass: ck.NODEMAILER_APP_PASSWORD
      }
    });

    return await transporter.sendMail({
      from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
      to: email,
      subject: subject,
      html: text
    })
  },
  async sendEmailRecoveryPassword(user: object, token: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ck.NODEMAILER_EMAIL,
        pass: ck.NODEMAILER_APP_PASSWORD
      }
    });

    return await transporter.sendMail({
      from: 'Serge Nodemailer <ck.NODEMAILER_EMAIL>',
      to: user.toString(),
      subject: "Recover password",
      html: `
        Hello, to recover your password, please enter the following link::
        http://localhost:3000/recovery/${token}
        `
    })
  }
};