import mongoose, {Document} from 'mongoose';

interface RegType extends Document {
  ip: string;
  createdAt: Date;
}

const Schema = mongoose.Schema

const UsersIPLast10secCollectionRegSchema = new Schema({
  ip: {
    type: String,
    required: [true, 'Id is required']
  },
  createdAt: Date
})

export const MyModeLast10secReg = mongoose.model<RegType>("usersIPLast10secCollectionReg", UsersIPLast10secCollectionRegSchema, "Last10secReg")