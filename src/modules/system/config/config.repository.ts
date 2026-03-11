/*
 * @FileDesc: 参数配置仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysConfig, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 参数配置仓储 */
@Injectable()
export class ConfigRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysConfig () {

        return this.txHost.tx.sysConfig

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysConfigOrderByWithRelationInput | Prisma.SysConfigOrderByWithRelationInput[] = {
        createdAt: "desc"
    }

    /**
     * 根据ID查询参数配置
     *
     * @param {number} id 配置ID
     * @param {Omit<Prisma.SysConfigFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysConfig | null>} 配置信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysConfigFindUniqueArgs, "where">): Promise<SysConfig | null> {

        const data = await this.sysConfig.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条参数配置
     *
     * @param {Omit<Prisma.SysConfigFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysConfig | null>} 配置信息
     */
    public async findFirst (options?: Omit<Prisma.SysConfigFindFirstArgs, "orderBy">): Promise<SysConfig | null> {

        const data = await this.sysConfig.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条参数配置
     *
     * @param {Omit<Prisma.SysConfigFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysConfig[]>} 配置列表
     */
    public async findMany (options?: Omit<Prisma.SysConfigFindManyArgs, "orderBy">): Promise<SysConfig[]> {

        const data = await this.sysConfig.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询参数配置列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysConfigFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysConfig>>} 配置列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysConfigFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysConfig>> {

        const [list, total] = await Promise.all([
            this.sysConfig.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysConfig.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增参数配置
     *
     * @param {Prisma.SysConfigCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysConfigCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysConfig>} 新增的配置
     */
    public async create (
        data: Prisma.SysConfigCreateArgs["data"],
        options?: Omit<Prisma.SysConfigCreateArgs, "data">
    ): Promise<SysConfig> {

        const result = await this.sysConfig.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增参数配置
     *
     * @param {Prisma.SysConfigCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysConfigCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysConfigCreateManyArgs["data"],
        options?: Omit<Prisma.SysConfigCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysConfig.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改参数配置
     *
     * @param {number} id 配置ID
     * @param {Prisma.SysConfigUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysConfigUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysConfig>} 更新后的配置
     */
    public async updateById (
        id: number,
        data: Prisma.SysConfigUpdateArgs["data"],
        options?: Omit<Prisma.SysConfigUpdateArgs, "where" | "data">
    ): Promise<SysConfig> {

        const result = await this.sysConfig.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改参数配置
     *
     * @param {Prisma.SysConfigUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysConfigUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysConfigUpdateManyArgs["data"],
        options?: Omit<Prisma.SysConfigUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysConfig.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID删除参数配置（硬删除）
     *
     * @param {number} id 配置ID
     * @param {Omit<Prisma.SysConfigDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysConfig>} 删除的配置
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysConfigDeleteArgs, "where">): Promise<SysConfig> {

        const result = await this.sysConfig.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除参数配置（硬删除）
     *
     * @param {Prisma.SysConfigDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysConfigDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysConfig.deleteMany(options)
        return result

    }

    /**
     * 根据ID校验参数配置是否存在
     *
     * @param {number} id 配置ID
     * @param {Omit<Prisma.SysConfigCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysConfigCountArgs, "where">): Promise<boolean> {

        const count = await this.sysConfig.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验参数配置是否存在
     *
     * @param {Prisma.SysConfigCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysConfigCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysConfigCountArgs["where"],
        options?: Omit<Prisma.SysConfigCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysConfig.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计参数配置数量
     *
     * @param {Prisma.SysConfigCountArgs} [options] 查询选项
     * @returns {Promise<number>} 配置数量
     */
    public async count (options?: Prisma.SysConfigCountArgs): Promise<number> {

        const result = await this.sysConfig.count(options)
        return result

    }

}
