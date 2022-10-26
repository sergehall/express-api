import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface EmailsRecoveryCode extends Document {
  email: string;
  recoveryCode: string;
  createdAt: string;
}

const EmailsRecoveryCodeSchema = new Schema({
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
