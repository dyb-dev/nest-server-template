/*
 * @FileDesc: 定时任务日志仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysJobLog, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 定时任务日志仓储 */
@Injectable()
export class JobLogRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysJobLog () {

        return this.txHost.tx.sysJobLog

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysJobLogOrderByWithRelationInput | Prisma.SysJobLogOrderByWithRelationInput[] = {
        executedAt: "desc"
    }

    /**
     * 根据ID查询定时任务日志
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysJobLogFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysJobLog | null>} 日志信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysJobLogFindUniqueArgs, "where">): Promise<SysJobLog | null> {

        const data = await this.sysJobLog.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条定时任务日志
     *
     * @param {Omit<Prisma.SysJobLogFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysJobLog | null>} 日志信息
     */
    public async findFirst (options?: Omit<Prisma.SysJobLogFindFirstArgs, "orderBy">): Promise<SysJobLog | null> {

        const data = await this.sysJobLog.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条定时任务日志
     *
     * @param {Omit<Prisma.SysJobLogFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysJobLog[]>} 日志列表
     */
    public async findMany (options?: Omit<Prisma.SysJobLogFindManyArgs, "orderBy">): Promise<SysJobLog[]> {

        const data = await this.sysJobLog.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询定时任务日志列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysJobLogFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysJobLog>>} 日志列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysJobLogFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysJobLog>> {

        const [list, total] = await Promise.all([
            this.sysJobLog.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysJobLog.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增定时任务日志
     *
     * @param {Prisma.SysJobLogCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysJobLogCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysJobLog>} 新增的日志
     */
    public async create (
        data: Prisma.SysJobLogCreateArgs["data"],
        options?: Omit<Prisma.SysJobLogCreateArgs, "data">
    ): Promise<SysJobLog> {

        const result = await this.sysJobLog.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增定时任务日志
     *
     * @param {Prisma.SysJobLogCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysJobLogCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysJobLogCreateManyArgs["data"],
        options?: Omit<Prisma.SysJobLogCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysJobLog.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改定时任务日志
     *
     * @param {number} id 日志ID
     * @param {Prisma.SysJobLogUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysJobLogUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysJobLog>} 更新后的日志
     */
    public async updateById (
        id: number,
        data: Prisma.SysJobLogUpdateArgs["data"],
        options?: Omit<Prisma.SysJobLogUpdateArgs, "where" | "data">
    ): Promise<SysJobLog> {

        const result = await this.sysJobLog.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改定时任务日志
     *
     * @param {Prisma.SysJobLogUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysJobLogUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysJobLogUpdateManyArgs["data"],
        options?: Omit<Prisma.SysJobLogUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysJobLog.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID删除定时任务日志（硬删除）
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysJobLogDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysJobLog>} 删除的日志
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysJobLogDeleteArgs, "where">): Promise<SysJobLog> {

        const result = await this.sysJobLog.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除定时任务日志（硬删除）
     *
     * @param {Prisma.SysJobLogDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysJobLogDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysJobLog.deleteMany(options)
        return result

    }

    /**
     * 根据ID校验定时任务日志是否存在
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysJobLogCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysJobLogCountArgs, "where">): Promise<boolean> {

        const count = await this.sysJobLog.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验定时任务日志是否存在
     *
     * @param {Prisma.SysJobLogCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysJobLogCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysJobLogCountArgs["where"],
        options?: Omit<Prisma.SysJobLogCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysJobLog.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计定时任务日志数量
     *
     * @param {Prisma.SysJobLogCountArgs} [options] 查询选项
     * @returns {Promise<number>} 日志数量
     */
    public async count (options?: Prisma.SysJobLogCountArgs): Promise<number> {

        const result = await this.sysJobLog.count(options)
        return result

    }

}
