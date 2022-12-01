import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";
import {BlackListRefreshTokenJWT, DTOJWT} from "../types/tsTypes";
import {injectable} from "inversify";

const ck = require('ckey')

@injectable()
export class BlackListRefreshTokenJWTRepository {

  async findJWT(refreshToken: string): Promise<BlackListRefreshTokenJWT | null> {
    return await MyModelBlackListRefreshTokenJWT.findOne({refreshToken: {$regex: refreshToken.slice(ck.NUM1, ck.NUM2)}})
  }

  async addJWT(dtoJWTToDB: DTOJWT) {
    return await MyModelBlackListRefreshTokenJWT.findOneAndUpdate(
      {refreshToken: {$regex: dtoJWTToDB.refreshToken.slice(ck.NUM1, ck.NUM2)}},
      {
        refreshToken: dtoJWTToDB.refreshToken,
        expirationDate: dtoJWTToDB.expirationDate
      },
      {upsert: true, returnDocument: "after"})
  }
}
