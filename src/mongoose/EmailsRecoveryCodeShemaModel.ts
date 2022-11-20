import mongoose from 'mongoose';
import {EmailRecoveryCodeType} from "../types/types";


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

export const MyModelEmailsRecoveryCode = mongoose.model<EmailRecoveryCodeType>("emailsRecoveryCode", EmailsRecoveryCodeSchema, 'EmailsRecoveryCode')
