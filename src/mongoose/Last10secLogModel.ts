import mongoose, {Document} from 'mongoose';

interface LogType extends Document {
  ip: string;
  createdAt: Date;
}

const Schema = mongoose.Schema

const UsersIPLast10secCollectionLogSchema = new Schema({
  ip: {
    type: String,
    required: [true, 'ip is required']
  },
  createdAt: Date
})

export const MyModeLast10secLog = mongoose.model<LogType>("usersIPLast10secCollectionLogSchema", UsersIPLast10secCollectionLogSchema, "Last10secLog")