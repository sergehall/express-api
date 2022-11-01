import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";
import {
  MyModeRedLast10secNewPasswordReq
} from "../mongoose/Last10secNewPassResModel";

export class UsersIPLast10secRepositories {
  async findByIpAndTimeRegConf(clientIp: string | null): Promise<number> {
    await MyModeLast10secRegConf.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeLast10secRegConf.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }

  async findByIpAndTimeReg(clientIp: string | null): Promise<number> {
    await MyModeLast10secReg.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeLast10secReg.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }

  async findByIpAndTimeLog(clientIp: string | null): Promise<number> {
    await MyModeLast10secLog.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeLast10secLog.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }

  async findByIpAndTimeRegEmailRes(clientIp: string | null): Promise<number> {
    await MyModeLast10secRedEmailRes.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeLast10secRedEmailRes.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }

  async findSameIpNewPasswordReq(clientIp: string | null): Promise<number> {
    await MyModeRedLast10secNewPasswordReq.create({ip: clientIp, createdAt: new Date().toISOString()})
    const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString()
    return await MyModeRedLast10secNewPasswordReq.countDocuments({ip: clientIp, createdAt: {$gte: currentTimeMinus10sec}})
  }
}