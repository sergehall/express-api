import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";
import {ioc} from "../IoCContainer";
import {MyModeRedLast10secNewPasswordReq} from "../mongoose/Last10secNewPassResModel";


export class ClearingIpWithCreatedAtOlder10Sec {
  // runs every 2 minutes
  async start() {
    setTimeout(async () => {
      await MyModeLast10secRegConf.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await MyModeLast10secReg.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await MyModeLast10secLog.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await MyModeLast10secRedEmailRes.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await MyModeRedLast10secNewPasswordReq.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 10).toISOString()}})
      await ioc.clearingIpWithCreatedAtOlder10Sec.start()
    }, 60000)
  }
}