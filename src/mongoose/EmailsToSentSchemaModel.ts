import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface EmailsToSent extends Document {
  email: string;
  confirmationCode: string;
  createdAt: Date;
}

const EmailsToSentSchema = new Schema({
  email: String,
  confirmationCode: String,
  createdAt: Date,
})

export const MyModelEmailsToSent = mongoose.model<EmailsToSent>("emailsToSent", EmailsToSentSchema, 'EmailsToSent')
