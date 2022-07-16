import {
  usersIPLast10secCollectionLog,
  usersIPLast10secCollectionReg,
  usersIPLast10secCollectionRegConf,
  usersIPLast10secCollectionRegEmailRes
} from "../repositories/db";

export const clearingIpWithDateOlder11Sec = async () => {
  // runs every 2 minutes
  setTimeout(async () => {
    await usersIPLast10secCollectionRegConf.deleteMany({"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}})
    await usersIPLast10secCollectionReg.deleteMany({"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}})
    await usersIPLast10secCollectionLog.deleteMany({"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}})
    await usersIPLast10secCollectionRegEmailRes.deleteMany({"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}})
    await clearingIpWithDateOlder11Sec()
  }, 60000)
}
