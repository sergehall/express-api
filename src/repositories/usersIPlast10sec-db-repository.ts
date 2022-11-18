import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";
import {
  MyModeRedLast10secNewPasswordReq
} from "../mongoose/Last10secNewPassResModel";

export class UsersIPLast10secRepositories {
  async addAndCountByIpAndTimeRegConf(clientIp: string | null): Promise<number> {
    await MyModeLast10secRegConf.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeLast10secRegConf.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }

  async addAndCountByIpAndTimeReg(clientIp: string | null): Promise<number> {
    await MyModeLast10secReg.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeLast10secReg.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }

  async addAndCountByIpAndTimeLog(clientIp: string | null): Promise<number> {
    await MyModeLast10secLog.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeLast10secLog.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }

  async addAndCountByIpAndTimeRegEmailRes(clientIp: string | null): Promise<number> {
    await MyModeLast10secRedEmailRes.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeLast10secRedEmailRes.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }

  async addAndCountSameIpNewPasswordReq(clientIp: string | null): Promise<number> {
    await MyModeRedLast10secNewPasswordReq.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeRedLast10secNewPasswordReq.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }
}