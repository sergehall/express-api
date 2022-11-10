import mongoose from 'mongoose';
import {Last10secReq} from "../types/types";


const UsersIPLast10secCollectionRegSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: [true, 'ip is required']
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required']
  }
})

export const MyModeLast10secReg = mongoose.model<Last10secReq>("usersIPLast10secCollectionReg", UsersIPLast10secCollectionRegSchema, "Last10secReg")