import {ioc} from "../IoCContainer";
import {MyModelBlackListRefreshTokenJWT} from "../mongoose/BlackListRefreshTokenJWTModel";


export class ClearingInvalidJWTFromBlackList {
  // runs every 1 min
  async start(skipCount=0) {
    setTimeout(async () => {
      let countValidJWT = 0
      const arrayJWT = await MyModelBlackListRefreshTokenJWT.find(
        {})
        .sort({addedAt: 1})
        .skip(skipCount)
        .limit(1000)
      for (let i in arrayJWT) {
        const verifyJWT = await ioc.jwtService.verifyRefreshJWT(arrayJWT[i].refreshToken)
        if (!verifyJWT) {
          await MyModelBlackListRefreshTokenJWT.deleteOne({refreshToken: arrayJWT[i].refreshToken})
        }
        if (verifyJWT) {
          countValidJWT += 1
        }
      }
      skipCount = countValidJWT
      await ioc.clearingInvalidJWTFromBlackList.start(skipCount)
    }, 1000)  //60000
  }
}

