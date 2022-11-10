import mongoose from 'mongoose';
import {BlackListRefreshTokenJWT} from "../types/types";


const BlackListRefreshTokenJWTSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: [true, 'refreshToken is required'],
    unique: true
  },
  expirationDate: {
    type: String,
    required: [true, 'addedAt is required'],
  }
})

export const MyModelBlackListRefreshTokenJWT = mongoose.model<BlackListRefreshTokenJWT>("blackListRefreshToken", BlackListRefreshTokenJWTSchema, "BlackListRefreshTokens")
