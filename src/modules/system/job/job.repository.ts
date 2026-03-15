/*
 * @FileDesc: 定时任务仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysJob, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 定时任务仓储 */
@Injectable()
export class JobRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysJob () {

        return this.txHost.tx.sysJob

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysJobOrderByWithRelationInput | Prisma.SysJobOrderByWithRelationInput[] = {
        createdAt: "desc"
    }

    /**
     * 根据ID查询定时任务
     *
     * @param {number} id 任务ID
     * @param {Omit<Prisma.SysJobFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysJob | null>} 定时任务信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysJobFindUniqueArgs, "where">): Promise<SysJob | null> {

        const data = await this.sysJob.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条定时任务
     *
     * @param {Omit<Prisma.SysJobFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysJob | null>} 定时任务信息
     */
    public async findFirst (options?: Omit<Prisma.SysJobFindFirstArgs, "orderBy">): Promise<SysJob | null> {

        const data = await this.sysJob.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条定时任务
     *
     * @param {Omit<Prisma.SysJobFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysJob[]>} 定时任务列表
     */
    public async findMany (options?: Omit<Prisma.SysJobFindManyArgs, "orderBy">): Promise<SysJob[]> {

        const data = await this.sysJob.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询定时任务列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysJobFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysJob>>} 定时任务列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysJobFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysJob>> {

        const [list, total] = await Promise.all([
            this.sysJob.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysJob.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增定时任务
     *
     * @param {Prisma.SysJobCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysJobCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysJob>} 新增的定时任务
     */
    public async create (data: Prisma.SysJobCreateArgs["data"], options?: Omit<Prisma.SysJobCreateArgs, "data">): Promise<SysJob> {

        const result = await this.sysJob.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增定时任务
     *
     * @param {Prisma.SysJobCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysJobCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysJobCreateManyArgs["data"],
        options?: Omit<Prisma.SysJobCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysJob.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改定时任务
     *
     * @param {number} id 任务ID
     * @param {Prisma.SysJobUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysJobUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysJob>} 更新后的定时任务
     */
    public async updateById (
        id: number,
        data: Prisma.SysJobUpdateArgs["data"],
        options?: Omit<Prisma.SysJobUpdateArgs, "where" | "data">
    ): Promise<SysJob> {

        const result = await this.sysJob.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改定时任务
     *
     * @param {Prisma.SysJobUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysJobUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysJobUpdateManyArgs["data"],
        options?: Omit<Prisma.SysJobUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysJob.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID删除定时任务（硬删除）
     *
     * @param {number} id 任务ID
     * @param {Omit<Prisma.SysJobDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysJob>} 删除的定时任务
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysJobDeleteArgs, "where">): Promise<SysJob> {

        const result = await this.sysJob.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除定时任务（硬删除）
     *
     * @param {Prisma.SysJobDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysJobDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysJob.deleteMany(options)
        return result

    }

    /**
     * 根据ID校验定时任务是否存在
     *
     * @param {number} id 任务ID
     * @param {Omit<Prisma.SysJobCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysJobCountArgs, "where">): Promise<boolean> {

        const count = await this.sysJob.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验定时任务是否存在
     *
     * @param {Prisma.SysJobCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysJobCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysJobCountArgs["where"],
        options?: Omit<Prisma.SysJobCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysJob.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计定时任务数量
     *
     * @param {Prisma.SysJobCountArgs} [options] 查询选项
     * @returns {Promise<number>} 定时任务数量
     */
    public async count (options?: Prisma.SysJobCountArgs): Promise<number> {

        const result = await this.sysJob.count(options)
        return result

    }

}
