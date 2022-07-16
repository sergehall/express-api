import {blackListRefreshTokenJWTCollection} from "./db";
import {BlackListRefreshTokenJWT} from "../types/all_types";


export class BlackListRefreshTokenJWTRepository {

  async findByRefreshTokenAndUserId(refreshToken: string): Promise<BlackListRefreshTokenJWT | null> {
    return await blackListRefreshTokenJWTCollection.findOne({"refreshToken": refreshToken})
  }

  async addRefreshTokenAndUserId(refreshToken: string) {

    const result = await blackListRefreshTokenJWTCollection.insertOne({
      refreshToken: refreshToken
    })

    return result.insertedId
  }
}
