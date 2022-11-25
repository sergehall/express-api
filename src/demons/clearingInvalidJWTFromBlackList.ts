import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";
import {injectable} from "inversify";
import {myContainer} from "../types/container";

@injectable()
export class ClearingInvalidJWTFromBlackList {
  // runs every 1 min
  async start() {
    setTimeout(async () => {
      const clearingInvalidJWTFromBlackList = await myContainer.resolve(ClearingInvalidJWTFromBlackList)
      await MyModelBlackListRefreshTokenJWT.deleteMany({expirationDate: {$lt: new Date().toISOString()}})
      await clearingInvalidJWTFromBlackList.start()
    }, 60000)
  }
}

