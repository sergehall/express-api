import mongoose from 'mongoose';
import {RefreshTokenJWTInBlackList} from "../types/types";


const BlackListRefreshTokenJWTSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: [true, 'refreshToken is required'],
    unique: true
  },
  addedAt: {
    type: String,
    required: [true, 'addedAt is required'],
  }
})

export const MyModelBlackListRefreshTokenJWT = mongoose.model<RefreshTokenJWTInBlackList>("blackListRefreshToken", BlackListRefreshTokenJWTSchema, "BlackListRefreshTokens")
