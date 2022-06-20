import {usersIPLast10secCollection} from "../repositories/db";

export const clearingIpWithDateOlder11Sec = async () => {
  // runs every 1 minutes
  setTimeout(async () => {
    await usersIPLast10secCollection.deleteMany({$and: [{"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}}]})
    clearingIpWithDateOlder11Sec()
  }, 600000)
}
