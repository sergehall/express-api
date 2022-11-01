import mongoose from 'mongoose';
import {BlackListRefreshTokenJWTType} from "../types/all_types";


const BlackListRefreshTokenJWTSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: [true, 'refreshToken is required'],
    unique: true
  }
})

export const MyModelBlackListRefreshTokenJWT = mongoose.model<BlackListRefreshTokenJWTType>("blackListRefreshToken", BlackListRefreshTokenJWTSchema, "BlackListRefreshTokens")
