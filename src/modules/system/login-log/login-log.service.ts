/*
 * @FileDesc: 登录日志服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Propagation, Transactional } from "@nestjs-cls/transactional"
import dayjs from "dayjs"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"

import { BatchDeleteRequestDto, GetListRequestDto, GetPageListRequestDto } from "./login-log.dto"
import { LoginLogRepository } from "./login-log.repository"

import type { SysLoginLog, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { PinoLogger } from "nestjs-pino"

/** 登录日志服务 */
@Injectable()
export class LoginLogService {

    /** 日志记录器 */
    @InjectPinoLogger(LoginLogService.name)
    private readonly logger: PinoLogger

    /** 登录日志仓储 */
    @Inject(LoginLogRepository)
    private readonly loginLogRepository: LoginLogRepository

    /**
     * 获取登录日志列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysLoginLog[]>} 日志列表
     */
    public async getList (params: GetListRequestDto): Promise<SysLoginLog[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.loginLogRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页登录日志列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysLoginLog>>} 日志列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysLoginLog>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.loginLogRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 批量删除登录日志
     *
     * @param {BatchDeleteRequestDto} params 批量删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const count = await this.loginLogRepository.count({
            where: { id: { in: params.ids } }
        })

        if (count !== params.ids.length) {

            throw new BusinessLogicException("部分日志记录不存在")

        }

        await this.loginLogRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 删除所有登录日志
     *
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async deleteAll (): Promise<void> {

        this.logger.info("[deleteAll] started")
        await this.loginLogRepository.deleteMany()
        this.logger.info("[deleteAll] completed")

    }

    /**
     * 创建登录日志
     *
     * @param {Prisma.SysLoginLogCreateArgs["data"]} params 创建参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>(Propagation.RequiresNew)
    public async create (params: Prisma.SysLoginLogCreateArgs["data"]): Promise<void> {

        await this.loginLogRepository.create(params)

    }

    /**
     * 删除已过期的登录日志（保留最近 30 天）
     *
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async deleteExpiredLoginLog (): Promise<void> {

        // TODO: 定时任务待标记
        const expiredAt = dayjs().subtract(30, "day").toDate()

        await this.loginLogRepository.deleteMany({
            where: {
                loginAt: { lt: expiredAt }
            }
        })

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysLoginLogWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysLoginLogWhereInput {

        const { ip, username, isSuccess, loginAtStart, loginAtEnd } = params

        return {
            ...ip && { ip: { contains: ip } },
            ...username && { username: { contains: username } },
            ...isSuccess !== void 0 && { isSuccess },
            ...(loginAtStart || loginAtEnd) && {
                loginAt: {
                    ...loginAtStart && { gte: new Date(loginAtStart) },
                    ...loginAtEnd && { lte: new Date(loginAtEnd) }
                }
            }
        }

    }

}
