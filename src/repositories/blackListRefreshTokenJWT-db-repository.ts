import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";
import {BlackListRefreshTokenJWT, PayloadType} from "../types/tsTypes";
import {injectable} from "inversify";
import {myContainer} from "../types/container";
import {JWTService} from "../application/jwt-service";

const ck = require('ckey')

@injectable()
export class BlackListRefreshTokenJWTRepository {

  async findJWT(refreshToken: string): Promise<BlackListRefreshTokenJWT | null> {
    return await MyModelBlackListRefreshTokenJWT.findOne({refreshToken: {$regex: refreshToken.slice(ck.NUM1, ck.NUM2)}})
  }

  async addJWT(refreshToken: string) {
    const jwtService = myContainer.resolve<JWTService>(JWTService)
    const payload: PayloadType = await jwtService.jwt_decode(refreshToken)
    const signBlackListJWT = refreshToken.slice(ck.NUM1, ck.NUM2);

    async function generateString(numCh: number) {
      let result = '';
      const charactersLength = refreshToken.length;
      for (let i = 0; i < numCh; i++) {
        result += refreshToken.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
    }

    const addJWTToBlackList = await MyModelBlackListRefreshTokenJWT.findOneAndUpdate(
      {refreshToken: signBlackListJWT},
      {
        refreshToken: signBlackListJWT + await generateString(ck.NUM3),
        expirationDate: new Date(payload.exp * 1000).toISOString()
      },
      {upsert: true, returnDocument: "after"})

    return addJWTToBlackList.refreshToken
  }
}
