import mongoose, {Document} from 'mongoose';

interface NewPasswordResType extends Document {
  ip: string;
  createdAt: string;
}

const Schema = mongoose.Schema

const NewPasswordReqSchema = new Schema({
  ip: {
    type: String,
    required: [true, 'ip is required']
  },
  createdAt: String
})

export const MyModeRedLast10secNewPasswordReq = mongoose.model<NewPasswordResType>("Last10secNewPasswordReqSchema", NewPasswordReqSchema, "Last10secNewPasswordReq")