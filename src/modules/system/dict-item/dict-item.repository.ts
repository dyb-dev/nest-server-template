/*
 * @FileDesc: 字典项仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysDictItem, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 字典项仓储 */
@Injectable()
export class DictItemRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysDictItem () {

        return this.txHost.tx.sysDictItem

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysDictItemOrderByWithRelationInput | Prisma.SysDictItemOrderByWithRelationInput[] =
        [{ sort: "asc" }, { createdAt: "desc" }]

    /**
     * 根据ID查询字典项
     *
     * @param {number} id 字典项ID
     * @param {Omit<Prisma.SysDictItemFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysDictItem | null>} 字典项信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysDictItemFindUniqueArgs, "where">): Promise<SysDictItem | null> {

        const data = await this.sysDictItem.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条字典项
     *
     * @param {Omit<Prisma.SysDictItemFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysDictItem | null>} 字典项信息
     */
    public async findFirst (options?: Omit<Prisma.SysDictItemFindFirstArgs, "orderBy">): Promise<SysDictItem | null> {

        const data = await this.sysDictItem.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条字典项
     *
     * @param {Omit<Prisma.SysDictItemFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysDictItem[]>} 字典项列表
     */
    public async findMany (options?: Omit<Prisma.SysDictItemFindManyArgs, "orderBy">): Promise<SysDictItem[]> {

        const data = await this.sysDictItem.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询字典项列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysDictItemFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysDictItem>>} 字典项列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysDictItemFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysDictItem>> {

        const [list, total] = await Promise.all([
            this.sysDictItem.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysDictItem.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增字典项
     *
     * @param {Prisma.SysDictItemCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysDictItemCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysDictItem>} 新增的字典项
     */
    public async create (
        data: Prisma.SysDictItemCreateArgs["data"],
        options?: Omit<Prisma.SysDictItemCreateArgs, "data">
    ): Promise<SysDictItem> {

        const result = await this.sysDictItem.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增字典项
     *
     * @param {Prisma.SysDictItemCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysDictItemCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysDictItemCreateManyArgs["data"],
        options?: Omit<Prisma.SysDictItemCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysDictItem.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改字典项
     *
     * @param {number} id 字典项ID
     * @param {Prisma.SysDictItemUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysDictItemUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysDictItem>} 更新后的字典项
     */
    public async updateById (
        id: number,
        data: Prisma.SysDictItemUpdateArgs["data"],
        options?: Omit<Prisma.SysDictItemUpdateArgs, "where" | "data">
    ): Promise<SysDictItem> {

        const result = await this.sysDictItem.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改字典项
     *
     * @param {Prisma.SysDictItemUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysDictItemUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysDictItemUpdateManyArgs["data"],
        options?: Omit<Prisma.SysDictItemUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysDictItem.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID删除字典项（硬删除）
     *
     * @param {number} id 字典项ID
     * @param {Omit<Prisma.SysDictItemDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysDictItem>} 删除的字典项
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysDictItemDeleteArgs, "where">): Promise<SysDictItem> {

        const result = await this.sysDictItem.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除字典项（硬删除）
     *
     * @param {Prisma.SysDictItemDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysDictItemDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysDictItem.deleteMany(options)
        return result

    }

    /**
     * 根据ID校验字典项是否存在
     *
     * @param {number} id 字典项ID
     * @param {Omit<Prisma.SysDictItemCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysDictItemCountArgs, "where">): Promise<boolean> {

        const count = await this.sysDictItem.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验字典项是否存在
     *
     * @param {Prisma.SysDictItemCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysDictItemCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysDictItemCountArgs["where"],
        options?: Omit<Prisma.SysDictItemCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysDictItem.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计字典项数量
     *
     * @param {Prisma.SysDictItemCountArgs} [options] 查询选项
     * @returns {Promise<number>} 字典项数量
     */
    public async count (options?: Prisma.SysDictItemCountArgs): Promise<number> {

        const result = await this.sysDictItem.count(options)
        return result

    }

}
