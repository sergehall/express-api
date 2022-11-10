import {ioc} from "../IoCContainer";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";


export class ClearingInvalidJWTFromBlackList {
  // runs every 1 min
  async start() {
    setTimeout(async () => {
      await MyModelBlackListRefreshTokenJWT.deleteMany({expirationDate: {$lt: new Date().toISOString()}})
      await ioc.clearingInvalidJWTFromBlackList.start()
    }, 60000)
  }
}

