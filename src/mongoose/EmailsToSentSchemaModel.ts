import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface EmailsToSent extends Document {
  email: string;
  confirmationCode: string;
  createdAt: string;
}

const EmailsToSentSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Id is required']
  },
  confirmationCode: {
    type: String,
    required: [true, 'Id is required']
  },
  createdAt: {
    type: String,
    required: [true, 'Id is required']
  }
})

export const MyModelEmailsToSent = mongoose.model<EmailsToSent>("emailsToSent", EmailsToSentSchema, 'EmailsToSent')
