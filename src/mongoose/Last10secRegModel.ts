import mongoose, {Document} from 'mongoose';

interface RegType extends Document {
  ip: string;
  createdAt: string;
}

const Schema = mongoose.Schema

const UsersIPLast10secCollectionRegSchema = new Schema({
  ip: {
    type: String,
    required: [true, 'ip is required']
  },
  createdAt: String
})

export const MyModeLast10secReg = mongoose.model<RegType>("usersIPLast10secCollectionReg", UsersIPLast10secCollectionRegSchema, "Last10secReg")