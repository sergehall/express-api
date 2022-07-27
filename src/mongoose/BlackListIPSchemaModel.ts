import mongoose, {Document} from 'mongoose';

const Schema = mongoose.Schema

interface BlackListIPType extends Document{
  ip: string;
  countTimes: Array<{
    createdAt: Date;
  }>
}

const BlackListIPSchema = new Schema({
  ip: {
    type: String,
    required: [true, 'Id is required'],
    default: ""
  },
  countTimes: {
    type: Array({
      createdAt: Date
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelBlackListIP = mongoose.model<BlackListIPType>("blackListIP", BlackListIPSchema, 'BlackListIP')
