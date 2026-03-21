/*
 * @FileDesc: 岗位仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysPost, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 岗位仓储 */
@Injectable()
export class PostRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysPost () {

        return this.txHost.tx.sysPost

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysPostOrderByWithRelationInput | Prisma.SysPostOrderByWithRelationInput[] = [
        { sort: "asc" },
        { createdAt: "desc" }
    ]

    /**
     * 根据ID查询岗位信息
     *
     * @param {number} id 岗位ID
     * @param {Omit<Prisma.SysPostFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysPost | null>} 岗位信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysPostFindUniqueArgs, "where">): Promise<SysPost | null> {

        const data = await this.sysPost.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条岗位信息
     *
     * @param {Omit<Prisma.SysPostFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysPost | null>} 岗位信息
     */
    public async findFirst (options?: Omit<Prisma.SysPostFindFirstArgs, "orderBy">): Promise<SysPost | null> {

        const data = await this.sysPost.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条岗位信息
     *
     * @param {Omit<Prisma.SysPostFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysPost[]>} 岗位列表
     */
    public async findMany (options?: Omit<Prisma.SysPostFindManyArgs, "orderBy">): Promise<SysPost[]> {

        const data = await this.sysPost.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询岗位信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysPostFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysPost>>} 岗位列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysPostFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysPost>> {

        const [list, total] = await Promise.all([
            this.sysPost.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysPost.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增岗位信息
     *
     * @param {Prisma.SysPostCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysPostCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysPost>} 新增的岗位
     */
    public async create (
        data: Prisma.SysPostCreateArgs["data"],
        options?: Omit<Prisma.SysPostCreateArgs, "data">
    ): Promise<SysPost> {

        const result = await this.sysPost.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增岗位信息
     *
     * @param {Prisma.SysPostCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysPostCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysPostCreateManyArgs["data"],
        options?: Omit<Prisma.SysPostCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysPost.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改岗位信息
     *
     * @param {number} id 岗位ID
     * @param {Prisma.SysPostUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysPostUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysPost>} 更新后的岗位
     */
    public async updateById (
        id: number,
        data: Prisma.SysPostUpdateArgs["data"],
        options?: Omit<Prisma.SysPostUpdateArgs, "where" | "data">
    ): Promise<SysPost> {

        const result = await this.sysPost.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改岗位信息
     *
     * @param {Prisma.SysPostUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysPostUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysPostUpdateManyArgs["data"],
        options?: Omit<Prisma.SysPostUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysPost.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID删除岗位信息（硬删除）
     *
     * @param {number} id 岗位ID
     * @param {Omit<Prisma.SysPostDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysPost>} 删除的岗位
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysPostDeleteArgs, "where">): Promise<SysPost> {

        const result = await this.sysPost.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除岗位信息（硬删除）
     *
     * @param {Prisma.SysPostDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysPostDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysPost.deleteMany(options)
        return result

    }

    /**
     * 根据ID校验岗位是否存在
     *
     * @param {number} id 岗位ID
     * @param {Omit<Prisma.SysPostCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysPostCountArgs, "where">): Promise<boolean> {

        const count = await this.sysPost.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验岗位是否存在
     *
     * @param {Prisma.SysPostCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysPostCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysPostCountArgs["where"],
        options?: Omit<Prisma.SysPostCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysPost.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计岗位数量
     *
     * @param {Prisma.SysPostCountArgs} [options] 查询选项
     * @returns {Promise<number>} 岗位数量
     */
    public async count (options?: Prisma.SysPostCountArgs): Promise<number> {

        const result = await this.sysPost.count(options)
        return result

    }

}
