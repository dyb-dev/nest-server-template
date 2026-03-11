/*
 * @FileDesc: 字典类型仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysDictType, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 字典类型仓储 */
@Injectable()
export class DictTypeRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysDictType () {

        return this.txHost.tx.sysDictType

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysDictTypeOrderByWithRelationInput | Prisma.SysDictTypeOrderByWithRelationInput[] =
        {
            createdAt: "desc"
        }

    /**
     * 根据ID查询字典类型
     *
     * @param {number} id 类型ID
     * @param {Omit<Prisma.SysDictTypeFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysDictType | null>} 字典类型信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysDictTypeFindUniqueArgs, "where">): Promise<SysDictType | null> {

        const data = await this.sysDictType.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条字典类型
     *
     * @param {Omit<Prisma.SysDictTypeFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysDictType | null>} 字典类型信息
     */
    public async findFirst (options?: Omit<Prisma.SysDictTypeFindFirstArgs, "orderBy">): Promise<SysDictType | null> {

        const data = await this.sysDictType.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条字典类型
     *
     * @param {Omit<Prisma.SysDictTypeFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysDictType[]>} 字典类型列表
     */
    public async findMany (options?: Omit<Prisma.SysDictTypeFindManyArgs, "orderBy">): Promise<SysDictType[]> {

        const data = await this.sysDictType.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询字典类型列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysDictTypeFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysDictType>>} 字典类型列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysDictTypeFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysDictType>> {

        const [list, total] = await Promise.all([
            this.sysDictType.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysDictType.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增字典类型
     *
     * @param {Prisma.SysDictTypeCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysDictTypeCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysDictType>} 新增的字典类型
     */
    public async create (
        data: Prisma.SysDictTypeCreateArgs["data"],
        options?: Omit<Prisma.SysDictTypeCreateArgs, "data">
    ): Promise<SysDictType> {

        const result = await this.sysDictType.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增字典类型
     *
     * @param {Prisma.SysDictTypeCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysDictTypeCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysDictTypeCreateManyArgs["data"],
        options?: Omit<Prisma.SysDictTypeCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysDictType.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改字典类型
     *
     * @param {number} id 类型ID
     * @param {Prisma.SysDictTypeUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysDictTypeUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysDictType>} 更新后的字典类型
     */
    public async updateById (
        id: number,
        data: Prisma.SysDictTypeUpdateArgs["data"],
        options?: Omit<Prisma.SysDictTypeUpdateArgs, "where" | "data">
    ): Promise<SysDictType> {

        const result = await this.sysDictType.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改字典类型
     *
     * @param {Prisma.SysDictTypeUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysDictTypeUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysDictTypeUpdateManyArgs["data"],
        options?: Omit<Prisma.SysDictTypeUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysDictType.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID删除字典类型（硬删除）
     *
     * @param {number} id 类型ID
     * @param {Omit<Prisma.SysDictTypeDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysDictType>} 删除的字典类型
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysDictTypeDeleteArgs, "where">): Promise<SysDictType> {

        const result = await this.sysDictType.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除字典类型（硬删除）
     *
     * @param {Prisma.SysDictTypeDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysDictTypeDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysDictType.deleteMany(options)
        return result

    }

    /**
     * 根据ID校验字典类型是否存在
     *
     * @param {number} id 类型ID
     * @param {Omit<Prisma.SysDictTypeCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysDictTypeCountArgs, "where">): Promise<boolean> {

        const count = await this.sysDictType.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验字典类型是否存在
     *
     * @param {Prisma.SysDictTypeCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysDictTypeCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysDictTypeCountArgs["where"],
        options?: Omit<Prisma.SysDictTypeCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysDictType.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计字典类型数量
     *
     * @param {Prisma.SysDictTypeCountArgs} [options] 查询选项
     * @returns {Promise<number>} 字典类型数量
     */
    public async count (options?: Prisma.SysDictTypeCountArgs): Promise<number> {

        const result = await this.sysDictType.count(options)
        return result

    }

}
