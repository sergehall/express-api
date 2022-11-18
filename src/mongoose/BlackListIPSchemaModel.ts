import mongoose from 'mongoose';
import {BlackListIPDBType} from "../types/types";


const BlackListIPSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: [true, 'ip is required'],
    default: ""
  },
  addedAt: {
    type: String,
    required: [true, 'addedAt is required']
  }
})

export const MyModelBlackListIP = mongoose.model<BlackListIPDBType>("blackListIP", BlackListIPSchema, 'BlackListIP')
