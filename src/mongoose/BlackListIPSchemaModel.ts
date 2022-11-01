import mongoose  from 'mongoose';
import {BlackListIPType} from "../types/all_types";



const BlackListIPSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: [true, 'ip is required'],
    default: ""
  },
  countTimes: {
    type: Array({
      createdAt: {
        type: String,
        required: [true, 'createdAt is required']
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelBlackListIP = mongoose.model<BlackListIPType>("blackListIP", BlackListIPSchema, 'BlackListIP')
