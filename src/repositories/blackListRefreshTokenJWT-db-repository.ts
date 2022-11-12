import {BlackListRefreshTokenJWT, PayloadType} from "../types/types";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";
import {ioc} from "../IoCContainer";

const ck = require('ckey')


export class BlackListRefreshTokenJWTRepository {

  async findJWT(refreshToken: string): Promise<BlackListRefreshTokenJWT | null> {
    return await MyModelBlackListRefreshTokenJWT.findOne({refreshToken: {$regex: refreshToken.slice(ck.NUM1, ck.NUM2)}})
  }

  async addJWT(refreshToken: string) {
    const payload: PayloadType = await ioc.jwtService.jwt_decode(refreshToken)
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
