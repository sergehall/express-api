import mongoose from 'mongoose';
import {EmailsToSent} from "../types/all_types";


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

export const MyModelEmailsToSent = mongoose.model<EmailsToSent>("emailsToSent", EmailsToSentSchema, 'EmailsToSent')
