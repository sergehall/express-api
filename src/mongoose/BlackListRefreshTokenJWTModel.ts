import mongoose, {Document} from 'mongoose';

interface BlackListRefreshTokenJWTType extends Document {
  refreshToken: string
}

const Schema = mongoose.Schema

const BlackListRefreshTokenJWTSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Id is required']
  },
  refreshToken: {
    type: String,
    required: [true, 'Id is required'],
    unique: true
  }
})

export const MyModelBlackListRefreshTokenJWT = mongoose.model<BlackListRefreshTokenJWTType>("blackListRefreshToken", BlackListRefreshTokenJWTSchema, "BlackListRefreshTokens")
