/*
 * @FileDesc: 操作日志服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Propagation, Transactional } from "@nestjs-cls/transactional"
import dayjs from "dayjs"
import { InjectPinoLogger } from "nestjs-pino"

import { Job } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"

import { BatchDeleteRequestDto, GetListRequestDto, GetPageListRequestDto } from "./operation-log.dto"
import { OperationLogRepository } from "./operation-log.repository"

import type { SysOperationLog, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { PinoLogger } from "nestjs-pino"

/** 操作日志服务 */
@Injectable()
export class OperationLogService {

    /** 日志记录器 */
    @InjectPinoLogger(OperationLogService.name)
    private readonly logger: PinoLogger

    /** 操作日志仓储 */
    @Inject(OperationLogRepository)
    private readonly operationLogRepository: OperationLogRepository

    /**
     * 获取操作日志列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysOperationLog[]>} 日志列表
     */
    public async getList (params: GetListRequestDto): Promise<SysOperationLog[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.operationLogRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页操作日志列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysOperationLog>>} 日志列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysOperationLog>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.operationLogRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 批量删除操作日志
     *
     * @param {BatchDeleteRequestDto} params 批量删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const count = await this.operationLogRepository.count({
            where: { id: { in: params.ids } }
        })

        if (count !== params.ids.length) {

            throw new BusinessLogicException("部分日志记录不存在")

        }

        await this.operationLogRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 删除所有操作日志
     *
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async deleteAll (): Promise<void> {

        this.logger.info("[deleteAll] started")
        await this.operationLogRepository.deleteMany()
        this.logger.info("[deleteAll] completed")

    }

    /**
     * 创建操作日志
     *
     * @param {Prisma.SysOperationLogCreateArgs["data"]} params 创建参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>(Propagation.RequiresNew)
    public async create (params: Prisma.SysOperationLogCreateArgs["data"]): Promise<void> {

        await this.operationLogRepository.create(params)

    }

    /**
     * 清理已过期的操作日志（保留最近 90 天）
     *
     * @returns {Promise<void>}
     */
    @Job("operation-log:cleanup")
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async cleanup (): Promise<void> {

        const expiredAt = dayjs().subtract(90, "day").toDate()

        await this.operationLogRepository.deleteMany({
            where: {
                operatedAt: { lt: expiredAt }
            }
        })

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysOperationLogWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysOperationLogWhereInput {

        const { requestId, username, ip, isSuccess, operatedAtStart, operatedAtEnd } = params

        return {
            ...requestId && { requestId: { contains: requestId } },
            ...username && { username: { contains: username } },
            ...ip && { ip: { contains: ip } },
            ...isSuccess !== void 0 && { isSuccess },
            ...(operatedAtStart || operatedAtEnd) && {
                operatedAt: {
                    ...operatedAtStart && { gte: new Date(operatedAtStart) },
                    ...operatedAtEnd && { lte: new Date(operatedAtEnd) }
                }
            }
        }

    }

}
