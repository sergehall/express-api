import mongoose, {Document} from 'mongoose';

interface BlackListRefreshTokenJWTType extends Document {
  refreshToken: string
}

const Schema = mongoose.Schema

const BlackListRefreshTokenJWTSchema = new Schema({
  refreshToken: {
    type: String,
    required: [true, 'refreshToken is required'],
    unique: true
  }
})

export const MyModelBlackListRefreshTokenJWT = mongoose.model<BlackListRefreshTokenJWTType>("blackListRefreshToken", BlackListRefreshTokenJWTSchema, "BlackListRefreshTokens")
