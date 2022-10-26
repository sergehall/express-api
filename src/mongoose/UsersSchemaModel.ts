import mongoose, {Document} from 'mongoose';

interface UserType extends Document {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

const Schema = mongoose.Schema

const UserSchema = new Schema({
  id: {
    type: String,
    required: [true, 'Id is required'],
    unique: true
  },
  login: {
    type: String,
    required: [true, 'login is required'],
    unique: true
  },
  email: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: [true, 'passwordHash is required']
  },
  passwordSalt: {
    type: String,
    required: [true, 'passwordSalt is required']
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required']
  }
})


export const MyModelUser = mongoose.model<UserType>("userSchema", UserSchema, "Users")
