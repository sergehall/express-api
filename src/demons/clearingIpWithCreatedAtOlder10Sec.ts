import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";
import {MyModeRedLast10secNewPasswordReq} from "../mongoose/Last10secNewPassResModel";
import {injectable} from "inversify";
import {container} from "../Container";

@injectable()
export class ClearingIpWithCreatedAtOlder10Sec {
  // runs every 2 minutes
  async start() {
    setTimeout(async () => {
      const clearingIpWithCreatedAtOlder10Sec = container.resolve(ClearingIpWithCreatedAtOlder10Sec)
      await MyModeLast10secRegConf.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await MyModeLast10secReg.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await MyModeLast10secLog.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await MyModeLast10secRedEmailRes.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await MyModeRedLast10secNewPasswordReq.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await clearingIpWithCreatedAtOlder10Sec.start()
    }, 60000)
  }
}