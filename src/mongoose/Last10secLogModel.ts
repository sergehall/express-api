import mongoose from 'mongoose';
import {Last10secReq} from "../types/types";


const UsersIPLast10secCollectionLogSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: [true, 'ip is required']
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required']
  }
})

export const MyModeLast10secLog = mongoose.model<Last10secReq>("usersIPLast10secCollectionLogSchema", UsersIPLast10secCollectionLogSchema, "Last10secLog")