import mongoose from 'mongoose';
import {EmailConfirmCodeType} from "../types/types";


const EmailsToSentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required']
  },
  confirmationCode: {
    type: String,
    required: [true, 'confirmationCode is required']
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required']
  }
})

export const MyModelEmailsConfirmCode = mongoose.model<EmailConfirmCodeType>("emailsConfirmationCode", EmailsToSentSchema, 'EmailsConfirmationCode')
