import mongoose, {Document} from 'mongoose';

interface RedEmailResType extends Document {
  ip: string;
  createdAt: Date;
}

const Schema = mongoose.Schema

const UsersIPLast10secCollectionRegEmailResSchema = new Schema({
  ip: {
    type: String,
    required: [true, 'Id is required']
  },
  createdAt: Date
})

export const MyModeLast10secRedEmailRes = mongoose.model<RedEmailResType>("usersIPLast10secCollectionRegEmailResSchema", UsersIPLast10secCollectionRegEmailResSchema, "Last10secRedEmailRes")