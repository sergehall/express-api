import {ioc} from "../IoCContainer";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";


export class ClearingInvalidJWTFromBlackList {
  // runs every 5 min
  async start() {
    setTimeout(async () => {
      const arrayJWT = await MyModelBlackListRefreshTokenJWT.find(
        {})
        .limit(1000)

      for (let i in arrayJWT) {
        const verifyJWT = await ioc.jwtService.verifyRefreshJWT(arrayJWT[i].refreshToken)
        if (!verifyJWT) {
          await MyModelBlackListRefreshTokenJWT.deleteOne({refreshToken: arrayJWT[i].refreshToken})
        }
      }
      await ioc.clearingInvalidJWTFromBlackList.start()
    }, 300000)
  }
}

