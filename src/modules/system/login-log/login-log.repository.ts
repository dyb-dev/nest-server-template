/*
 * @FileDesc: 登录日志仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysLoginLog, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 登录日志仓储 */
@Injectable()
export class LoginLogRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysLoginLog () {

        return this.txHost.tx.sysLoginLog

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysLoginLogOrderByWithRelationInput | Prisma.SysLoginLogOrderByWithRelationInput[] =
        {
            loginAt: "desc"
        }

    /**
     * 根据 ID 查询登录日志
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysLoginLogFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysLoginLog | null>} 日志信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysLoginLogFindUniqueArgs, "where">): Promise<SysLoginLog | null> {

        const data = await this.sysLoginLog.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条登录日志
     *
     * @param {Omit<Prisma.SysLoginLogFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysLoginLog | null>} 日志信息
     */
    public async findFirst (options?: Omit<Prisma.SysLoginLogFindFirstArgs, "orderBy">): Promise<SysLoginLog | null> {

        const data = await this.sysLoginLog.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条登录日志
     *
     * @param {Omit<Prisma.SysLoginLogFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysLoginLog[]>} 日志列表
     */
    public async findMany (options?: Omit<Prisma.SysLoginLogFindManyArgs, "orderBy">): Promise<SysLoginLog[]> {

        const data = await this.sysLoginLog.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询登录日志列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysLoginLogFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysLoginLog>>} 日志列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysLoginLogFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysLoginLog>> {

        const [list, total] = await Promise.all([
            this.sysLoginLog.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysLoginLog.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增登录日志
     *
     * @param {Prisma.SysLoginLogCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysLoginLogCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysLoginLog>} 新增的日志
     */
    public async create (
        data: Prisma.SysLoginLogCreateArgs["data"],
        options?: Omit<Prisma.SysLoginLogCreateArgs, "data">
    ): Promise<SysLoginLog> {

        const result = await this.sysLoginLog.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增登录日志
     *
     * @param {Prisma.SysLoginLogCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysLoginLogCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysLoginLogCreateManyArgs["data"],
        options?: Omit<Prisma.SysLoginLogCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysLoginLog.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据 ID 修改登录日志
     *
     * @param {number} id 日志ID
     * @param {Prisma.SysLoginLogUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysLoginLogUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysLoginLog>} 更新后的日志
     */
    public async updateById (
        id: number,
        data: Prisma.SysLoginLogUpdateArgs["data"],
        options?: Omit<Prisma.SysLoginLogUpdateArgs, "where" | "data">
    ): Promise<SysLoginLog> {

        const result = await this.sysLoginLog.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改登录日志
     *
     * @param {Prisma.SysLoginLogUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysLoginLogUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysLoginLogUpdateManyArgs["data"],
        options?: Omit<Prisma.SysLoginLogUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysLoginLog.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据 ID 删除登录日志（硬删除）
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysLoginLogDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysLoginLog>} 删除的日志
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysLoginLogDeleteArgs, "where">): Promise<SysLoginLog> {

        const result = await this.sysLoginLog.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除登录日志（硬删除）
     *
     * @param {Prisma.SysLoginLogDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysLoginLogDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysLoginLog.deleteMany(options)
        return result

    }

    /**
     * 根据 ID 校验登录日志是否存在
     *
     * @param {number} id 日志ID
     * @param {Omit<Prisma.SysLoginLogCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysLoginLogCountArgs, "where">): Promise<boolean> {

        const count = await this.sysLoginLog.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验登录日志是否存在
     *
     * @param {Prisma.SysLoginLogCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysLoginLogCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysLoginLogCountArgs["where"],
        options?: Omit<Prisma.SysLoginLogCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysLoginLog.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计登录日志数量
     *
     * @param {Prisma.SysLoginLogCountArgs} [options] 查询选项
     * @returns {Promise<number>} 日志数量
     */
    public async count (options?: Prisma.SysLoginLogCountArgs): Promise<number> {

        const result = await this.sysLoginLog.count(options)
        return result

    }

}
