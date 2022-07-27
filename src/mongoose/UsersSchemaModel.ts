import mongoose, {Document} from 'mongoose';
import {ObjectId} from "mongodb";

interface UserType extends Document {
  _id: ObjectId;
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

const Schema = mongoose.Schema

const UserSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Id is required']
  },
  id: {
    type: String,
    required: [true, 'Id is required'],
    unique: true
  },
  login: {
    type: String,
    required: [true, 'Id is required']
  },
  email: {
    type: String
  },
  passwordHash: {
    type: String,
    required: [true, 'Id is required']
  },
  passwordSalt: {
    type: String,
    required: [true, 'Id is required']
  },
  createdAt: {
    type: String,
    required: [true, 'Id is required']
  }
})


export const MyModelUser = mongoose.model<UserType>("userSchema", UserSchema, "Users")
