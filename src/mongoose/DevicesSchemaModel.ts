import mongoose, {Document} from 'mongoose';


const Schema = mongoose.Schema

interface DevicesSchemaModel extends Document {
  userId: string
  ip: string
  title: string
  lastActiveDate: string
  expirationDate: string
  deviceId: string
}


const DevicesSchemaSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'Id is required']
  },
  ip: {
    type: String,
    required: [true, 'Id is required']
  },
  title: {
    type: String,
    required: [true, 'Id is required']
  },
  lastActiveDate: {
    type: String,
    required: [true, 'Id is required']
  },
  expirationDate: {
    type: String,
    required: [true, 'Id is required']
  },
  deviceId: {
    type: String,
    required: [false, 'Id is not required'],
    unique: true
  }
})

export const MyModelDevicesSchema = mongoose.model<DevicesSchemaModel>("devicesSchema", DevicesSchemaSchema, "sessionDevices")
