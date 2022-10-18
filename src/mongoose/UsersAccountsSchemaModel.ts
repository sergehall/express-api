import mongoose, {Document} from 'mongoose';


const Schema = mongoose.Schema

interface UserAccountType extends Document {
  accountData: {
    id: string;
    login: string;
    email: string | null;
    passwordSalt: string;
    passwordHash: string;
    createdAt: string
  },
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
    sentEmail: Array<object>;
  },
  registrationData: Array<{
    ip: string | null;
    createdAt: string;
  }>
}


const UserAccountSchema = new Schema({
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
      type: String,
      required: [true, 'Id is required']
    },
  },
  emailConfirmation: {
    confirmationCode: {
      type: String,
      required: [true, 'Id is required']
    },
    expirationDate: {
      type: String,
      required: [true, 'Id is required']
    },
    isConfirmed: Boolean,
    sentEmail: {
      type: Array({
        sendTime: {
          type: String,
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
        type: String,
        required: [true, 'Id is required']
      }
    }),
    validate: (v: any) => Array.isArray(v)
  }
})

export const MyModelUserAccount = mongoose.model<UserAccountType>("userAccountSchema", UserAccountSchema, "UsersAccount")
