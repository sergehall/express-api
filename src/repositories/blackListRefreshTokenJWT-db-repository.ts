import {BlackListRefreshTokenJWT} from "../types/all_types";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";


export class BlackListRefreshTokenJWTRepository {

  async findByRefreshTokenAndUserId(refreshToken: string): Promise<BlackListRefreshTokenJWT | null> {
    return await MyModelBlackListRefreshTokenJWT.findOne({"refreshToken": refreshToken})
  }

  async addRefreshTokenAndUserId(refreshToken: string) {
    const result = await MyModelBlackListRefreshTokenJWT.create({refreshToken: refreshToken})
    return result.refreshToken
  }
}
