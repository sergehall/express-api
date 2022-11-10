import {PayloadType, RefreshTokenJWTInBlackList} from "../types/types";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";
import {ioc} from "../IoCContainer";


export class BlackListRefreshTokenJWTRepository {

  async findByRefreshTokenAndUserId(refreshToken: string): Promise<RefreshTokenJWTInBlackList | null> {
    return await MyModelBlackListRefreshTokenJWT.findOne({refreshToken: refreshToken})
  }

  async addRefreshTokenAndUserId(refreshToken: string) {
    const payload: PayloadType = ioc.jwtService.jwt_decode(refreshToken);
    const result = await MyModelBlackListRefreshTokenJWT.create(
      {
        refreshToken: refreshToken,
        addedAt: new Date(payload.exp * 1000).toISOString()
      })
    return result.refreshToken
  }
}
