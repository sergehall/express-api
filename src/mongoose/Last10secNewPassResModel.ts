import mongoose from 'mongoose';
import {Last10secReq} from "../types/types";


const NewPasswordReqSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: [true, 'ip is required']
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required']
  }
})

export const MyModeRedLast10secNewPasswordReq = mongoose.model<Last10secReq>("Last10secNewPasswordReqSchema", NewPasswordReqSchema, "Last10secNewPasswordReq")