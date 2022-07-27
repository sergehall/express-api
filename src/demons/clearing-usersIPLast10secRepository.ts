import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";


export const clearingIpWithDateOlder11Sec = async () => {
  // runs every 2 minutes
  setTimeout(async () => {
    await MyModeLast10secRegConf.deleteMany({"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}})
    await MyModeLast10secReg.deleteMany({"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}})
    await MyModeLast10secLog.deleteMany({"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}})
    await MyModeLast10secRedEmailRes.deleteMany({"createdAt": {$lte: new Date(Date.now() - 1000 * 10)}})
    await clearingIpWithDateOlder11Sec()
  }, 60000)
}
