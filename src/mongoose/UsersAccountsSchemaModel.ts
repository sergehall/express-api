import mongoose from 'mongoose';
import {UserAccountType} from "../types/all_types";



const UserAccountSchema = new mongoose.Schema({
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
    passwordSalt: {
      type: String,
      required: [false, 'passwordSalt is not required']
    },
    createdAt: {
      type: String,
      required: [true, 'createdAt is required']
    },
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
        sendTime: {
          type: String,
          required: [true, 'sendTime is required']
        }
      }),
      validate: (v: any) => Array.isArray(v)
    }
  },
  registrationData: {
    type: Array({
      ip: {
        type: String,
        default: null
      },

      createdAt: {
        type: String,
        required: [true, 'createdAt is required']
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelUserAccount = mongoose.model<UserAccountType>("userAccountSchema", UserAccountSchema, "UsersAccount")
