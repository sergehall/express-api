import {RefreshTokenJWTInBlackList} from "../types/types";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";


export class BlackListRefreshTokenJWTRepository {

  async findByRefreshTokenAndUserId(refreshToken: string): Promise<RefreshTokenJWTInBlackList | null> {
    return await MyModelBlackListRefreshTokenJWT.findOne({refreshToken: refreshToken})
  }

  async addRefreshTokenAndUserId(refreshToken: string) {
    const result = await MyModelBlackListRefreshTokenJWT.create(
      {
        refreshToken: refreshToken,
        addedAt: new Date().toISOString()
      })
    return result.refreshToken
  }
}
