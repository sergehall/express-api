import mongoose from 'mongoose';
import {DevicesSchemaModel} from "../types/types";



const DevicesSchemaSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'userId is required']
  },
  ip: {
    type: String,
    required: [true, 'ip is required']
  },
  title: {
    type: String,
    required: [true, 'title is required']
  },
  lastActiveDate: {
    type: String,
    required: [true, 'lastActiveDate is required']
  },
  expirationDate: {
    type: String,
    required: [true, 'expirationDate is required']
  },
  deviceId: {
    type: String,
    required: [false, 'deviceId is not required'],
    unique: true
  }
})

export const MyModelDevicesSchema = mongoose.model<DevicesSchemaModel>("devicesSchema", DevicesSchemaSchema, "sessionDevices")
