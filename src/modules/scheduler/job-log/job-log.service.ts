/*
 * @FileDesc: 定时任务日志服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Propagation, Transactional } from "@nestjs-cls/transactional"
import dayjs from "dayjs"
import { InjectPinoLogger } from "nestjs-pino"

import { Job } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"

import { BatchDeleteRequestDto, GetListRequestDto, GetPageListRequestDto } from "./job-log.dto"
import { JobLogRepository } from "./job-log.repository"

import type { SysJobLog, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { PinoLogger } from "nestjs-pino"

/** 定时任务日志服务 */
@Injectable()
export class JobLogService {

    /** 日志记录器 */
    @InjectPinoLogger(JobLogService.name)
    private readonly logger: PinoLogger

    /** 定时任务日志仓储 */
    @Inject(JobLogRepository)
    private readonly jobLogRepository: JobLogRepository

    /**
     * 获取定时任务日志列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysJobLog[]>} 日志列表
     */
    public async getList (params: GetListRequestDto): Promise<SysJobLog[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.jobLogRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页定时任务日志列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysJobLog>>} 日志列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysJobLog>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.jobLogRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 批量删除定时任务日志
     *
     * @param {BatchDeleteRequestDto} params 批量删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const count = await this.jobLogRepository.count({
            where: { id: { in: params.ids } }
        })

        if (count !== params.ids.length) {

            throw new BusinessLogicException("部分日志记录不存在")

        }

        await this.jobLogRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 删除所有定时任务日志
     *
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async deleteAll (): Promise<void> {

        this.logger.info("[deleteAll] started")
        await this.jobLogRepository.deleteMany()
        this.logger.info("[deleteAll] completed")

    }

    /**
     * 创建定时任务日志
     *
     * @param {Prisma.SysJobLogCreateArgs["data"]} params 创建参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>(Propagation.RequiresNew)
    public async create (params: Prisma.SysJobLogCreateArgs["data"]): Promise<void> {

        await this.jobLogRepository.create(params)

    }

    /**
     * 清理已过期的定时任务日志（保留最近 30 天）
     *
     * @returns {Promise<void>}
     */
    @Job("job-log:cleanup")
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async cleanup (): Promise<void> {

        const expiredAt = dayjs().subtract(30, "day").toDate()

        await this.jobLogRepository.deleteMany({
            where: {
                executedAt: { lt: expiredAt }
            }
        })

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysJobLogWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysJobLogWhereInput {

        const { name, isSystem, isSuccess, executedAtStart, executedAtEnd } = params

        return {
            ...name && { name: { contains: name } },
            ...isSystem !== void 0 && { isSystem },
            ...isSuccess !== void 0 && { isSuccess },
            ...(executedAtStart || executedAtEnd) && {
                executedAt: {
                    ...executedAtStart && { gte: new Date(executedAtStart) },
                    ...executedAtEnd && { lte: new Date(executedAtEnd) }
                }
            }
        }

    }

}
