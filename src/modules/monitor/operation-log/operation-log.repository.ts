/*
 * @FileDesc: 操作日志仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysOperationLog, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 操作日志仓储 */
@Injectable()
export class OperationLogRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysOperationLog () {

        return this.txHost.tx.sysOperationLog

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY:
        | Prisma.SysOperationLogOrderByWithRelationInput
        | Prisma.SysOperationLogOrderByWithRelationInput[] = {
            operatedAt: "desc"
        }

    /**
     * 根据 ID 查询操作日志
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysOperationLogFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysOperationLog | null>} 日志信息
     */
    public async findById (
        id: number,
        options?: Omit<Prisma.SysOperationLogFindUniqueArgs, "where">
    ): Promise<SysOperationLog | null> {

        const data = await this.sysOperationLog.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条操作日志
     *
     * @param {Omit<Prisma.SysOperationLogFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysOperationLog | null>} 日志信息
     */
    public async findFirst (options?: Omit<Prisma.SysOperationLogFindFirstArgs, "orderBy">): Promise<SysOperationLog | null> {

        const data = await this.sysOperationLog.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条操作日志
     *
     * @param {Omit<Prisma.SysOperationLogFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysOperationLog[]>} 日志列表
     */
    public async findMany (options?: Omit<Prisma.SysOperationLogFindManyArgs, "orderBy">): Promise<SysOperationLog[]> {

        const data = await this.sysOperationLog.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询操作日志列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysOperationLogFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysOperationLog>>} 日志列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysOperationLogFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysOperationLog>> {

        const [list, total] = await Promise.all([
            this.sysOperationLog.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysOperationLog.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增操作日志
     *
     * @param {Prisma.SysOperationLogCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysOperationLogCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysOperationLog>} 新增的日志
     */
    public async create (
        data: Prisma.SysOperationLogCreateArgs["data"],
        options?: Omit<Prisma.SysOperationLogCreateArgs, "data">
    ): Promise<SysOperationLog> {

        const result = await this.sysOperationLog.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增操作日志
     *
     * @param {Prisma.SysOperationLogCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysOperationLogCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysOperationLogCreateManyArgs["data"],
        options?: Omit<Prisma.SysOperationLogCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysOperationLog.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据 ID 修改操作日志
     *
     * @param {number} id 日志ID
     * @param {Prisma.SysOperationLogUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysOperationLogUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysOperationLog>} 更新后的日志
     */
    public async updateById (
        id: number,
        data: Prisma.SysOperationLogUpdateArgs["data"],
        options?: Omit<Prisma.SysOperationLogUpdateArgs, "where" | "data">
    ): Promise<SysOperationLog> {

        const result = await this.sysOperationLog.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改操作日志
     *
     * @param {Prisma.SysOperationLogUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysOperationLogUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysOperationLogUpdateManyArgs["data"],
        options?: Omit<Prisma.SysOperationLogUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysOperationLog.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据 ID 删除操作日志（硬删除）
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysOperationLogDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysOperationLog>} 删除的日志
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysOperationLogDeleteArgs, "where">): Promise<SysOperationLog> {

        const result = await this.sysOperationLog.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除操作日志（硬删除）
     *
     * @param {Prisma.SysOperationLogDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysOperationLogDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysOperationLog.deleteMany(options)
        return result

    }

    /**
     * 根据 ID 校验操作日志是否存在
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysOperationLogCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysOperationLogCountArgs, "where">): Promise<boolean> {

        const count = await this.sysOperationLog.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验操作日志是否存在
     *
     * @param {Prisma.SysOperationLogCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysOperationLogCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysOperationLogCountArgs["where"],
        options?: Omit<Prisma.SysOperationLogCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysOperationLog.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计操作日志数量
     *
     * @param {Prisma.SysOperationLogCountArgs} [options] 查询选项
     * @returns {Promise<number>} 日志数量
     */
    public async count (options?: Prisma.SysOperationLogCountArgs): Promise<number> {

        const result = await this.sysOperationLog.count(options)
        return result

    }

}
