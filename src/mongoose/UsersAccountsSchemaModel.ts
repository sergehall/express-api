import mongoose, {Document} from 'mongoose';
import {ObjectId} from "mongodb";


const Schema = mongoose.Schema

interface UserAccountType extends Document {
  _id: ObjectId;
  accountData: {
    id: string;
    login: string;
    email: string | null;
    passwordSalt: string;
    passwordHash: string;
    createdAt: Date
  },
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
    sentEmail: Array<object>;
  },
  registrationData: Array<{
    ip: string | null;
    createdAt: Date;
  }>
}


const UserAccountSchema = new Schema({
  _id: Schema.Types.ObjectId,
  accountData: {
    id: {
      type: String,
      required: [true, 'Id is required'],
    },
    login: {
      type: String,
      required: [true, 'Id is required'],
      unique: true
    },
    email: {
      type: String,
      default: null
    },
    passwordHash: {
      type: String,
      required: [true, 'Id is required']
    },
    passwordSalt: {
      type: String,
      required: [false, 'Id is not required']
    },
    createdAt: {
      type: Date,
      required: [true, 'Id is required']
    },
  },
  emailConfirmation: {
    confirmationCode: {
      type: String,
      required: [true, 'Id is required']
    },
    expirationDate: {
      type: Date,
      required: [true, 'Id is required']
    },
    isConfirmed: Boolean,
    sentEmail: {
      type: Array({
        sendTime: {
          type: Date,
          required: [true, 'Id is required']
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
        type: Date,
        required: [true, 'Id is required']
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelUserAccount = mongoose.model<UserAccountType>("userAccountSchema", UserAccountSchema, "UsersAccount")
