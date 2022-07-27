import mongoose, {Document} from 'mongoose';

interface RegConfType extends Document {
  ip: string;
  createdAt: Date
}

const Schema = mongoose.Schema

const UsersIPLast10secCollectionRegConfSchema = new Schema({
  ip: {
    type: String,
    required: [true, 'Id is required']
  },
  createdAt: Date
})

export const MyModeLast10secRegConf = mongoose.model<RegConfType>("usersIPLast10secCollectionRegConfSchema", UsersIPLast10secCollectionRegConfSchema, "Last10secRegConf")