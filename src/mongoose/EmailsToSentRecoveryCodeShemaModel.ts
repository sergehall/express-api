import mongoose from 'mongoose';
import {EmailsRecoveryCode} from "../types/types";


const EmailsRecoveryCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Id is required'],
  },
  recoveryCode: {
    type: String,
    required: [true, 'Id is required'],
  },
  createdAt: {
    type: String,
    required: [true, 'Id is required'],
  }
})

export const MyModelEmailsToSentRecoveryCode = mongoose.model<EmailsRecoveryCode>("emailsToSentRecoveryCode", EmailsRecoveryCodeSchema, 'EmailsToSentRecoveryCode')
