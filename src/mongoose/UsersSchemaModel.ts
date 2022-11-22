import mongoose from 'mongoose';
import {UserType} from "../types/types";


const UserSchema = new mongoose.Schema({
  accountData: {
    id: {
      type: String,
      required: [true, 'Id is required'],
    },
    login: {
      type: String,
      required: [true, 'login is required'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true
    },
    passwordHash: {
      type: String,
      required: [true, 'passwordHash is required']
    },
    createdAt: {
      type: String,
      required: [true, 'createdAt is required']
    }
  },
  emailConfirmation: {
    confirmationCode: {
      type: String,
      required: [true, 'confirmationCode is required']
    },
    expirationDate: {
      type: String,
      required: [true, 'expirationDate is required']
    },
    isConfirmed: Boolean,
    sentEmail: {
      type: Array({
        type: String,
        required: [true, 'sentAt is required']
      }),
      validate: (v: any) => Array.isArray(v)
    }
  },
  registrationData: {
    ip: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      required: [true, 'userAgent is required']
    }
  }
})

export const MyModelUser = mongoose.model<UserType>("userSchema", UserSchema, "Users")
