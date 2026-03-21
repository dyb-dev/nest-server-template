/*
 * @FileDesc: 部门仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysDept, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 部门仓储 */
@Injectable()
export class DeptRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysDept () {

        return this.txHost.tx.sysDept

    }

    /** 默认查询条件 */
    private readonly DEFAULT_WHERE: Prisma.SysDeptWhereInput = { deletedAt: 0 }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysDeptOrderByWithRelationInput | Prisma.SysDeptOrderByWithRelationInput[] = [
        { sort: "asc" },
        { createdAt: "desc" }
    ]

    /** 默认排除字段 */
    private readonly DEFAULT_OMIT: Prisma.SysDeptOmit = {
        deletedAt: true
    }

    /**
     * 根据ID查询部门信息
     *
     * @param {number} id 部门ID
     * @param {Omit<Prisma.SysDeptFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<Omit<SysDept, "deletedAt"> | null>} 部门信息
     */
    public async findById (
        id: number,
        options?: Omit<Prisma.SysDeptFindUniqueArgs, "where">
    ): Promise<Omit<SysDept, "deletedAt"> | null> {

        const data = await this.sysDept.findUnique({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                id
            },
            omit: {
                ...this.DEFAULT_OMIT,
                ...options?.omit
            }
        })
        return data

    }

    /**
     * 根据条件查询第一条部门信息
     *
     * @param {Omit<Prisma.SysDeptFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<Omit<SysDept, "deletedAt"> | null>} 部门信息
     */
    public async findFirst (options?: Omit<Prisma.SysDeptFindFirstArgs, "orderBy">): Promise<Omit<SysDept, "deletedAt"> | null> {

        const data = await this.sysDept.findFirst({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                ...options?.where
            },
            orderBy: this.DEFAULT_ORDER_BY,
            omit: {
                ...this.DEFAULT_OMIT,
                ...options?.omit
            }
        })
        return data

    }

    /**
     * 根据条件查询多条部门信息
     *
     * @param {Omit<Prisma.SysDeptFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<Omit<SysDept, "deletedAt">[]>} 部门列表
     */
    public async findMany (options?: Omit<Prisma.SysDeptFindManyArgs, "orderBy">): Promise<Omit<SysDept, "deletedAt">[]> {

        const data = await this.sysDept.findMany({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                ...options?.where
            },
            orderBy: this.DEFAULT_ORDER_BY,
            omit: {
                ...this.DEFAULT_OMIT,
                ...options?.omit
            }
        })
        return data

    }

    /**
     * 根据条件分页查询部门信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysDeptFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<Omit<SysDept, "deletedAt">>>} 部门列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysDeptFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<Omit<SysDept, "deletedAt">>> {

        const finalWhere: Prisma.SysDeptWhereInput = {
            ...this.DEFAULT_WHERE,
            ...options?.where
        }
        const [list, total] = await Promise.all([
            this.sysDept.findMany({
                ...options,
                where: finalWhere,
                orderBy: this.DEFAULT_ORDER_BY,
                omit: {
                    ...this.DEFAULT_OMIT,
                    ...options?.omit
                },
                skip,
                take
            }),
            this.sysDept.count({ where: finalWhere })
        ])
        return { list, total }

    }

    /**
     * 新增部门信息
     *
     * @param {Prisma.SysDeptCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysDeptCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<Omit<SysDept, "deletedAt">>} 新增的部门
     */
    public async create (
        data: Prisma.SysDeptCreateArgs["data"],
        options?: Omit<Prisma.SysDeptCreateArgs, "data">
    ): Promise<Omit<SysDept, "deletedAt">> {

        const result = await this.sysDept.create({
            ...options,
            data,
            omit: {
                ...this.DEFAULT_OMIT,
                ...options?.omit
            }
        })
        return result

    }

    /**
     * 批量新增部门信息
     *
     * @param {Prisma.SysDeptCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysDeptCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysDeptCreateManyArgs["data"],
        options?: Omit<Prisma.SysDeptCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysDept.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改部门信息
     *
     * @param {number} id 部门ID
     * @param {Prisma.SysDeptUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysDeptUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<Omit<SysDept, "deletedAt">>} 更新后的部门
     */
    public async updateById (
        id: number,
        data: Prisma.SysDeptUpdateArgs["data"],
        options?: Omit<Prisma.SysDeptUpdateArgs, "where" | "data">
    ): Promise<Omit<SysDept, "deletedAt">> {

        const result = await this.sysDept.update({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                id
            },
            data,
            omit: {
                ...this.DEFAULT_OMIT,
                ...options?.omit
            }
        })
        return result

    }

    /**
     * 批量修改部门信息
     *
     * @param {Prisma.SysDeptUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysDeptUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysDeptUpdateManyArgs["data"],
        options?: Omit<Prisma.SysDeptUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysDept.updateMany({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                ...options?.where
            },
            data
        })
        return result

    }

    /**
     * 根据ID删除部门信息（硬删除）
     *
     * @param {number} id 部门ID
     * @param {Omit<Prisma.SysDeptDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<Omit<SysDept, "deletedAt">>} 删除的部门
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysDeptDeleteArgs, "where">): Promise<Omit<SysDept, "deletedAt">> {

        const result = await this.sysDept.delete({
            ...options,
            where: { id },
            omit: {
                ...this.DEFAULT_OMIT,
                ...options?.omit
            }
        })
        return result

    }

    /**
     * 批量删除部门信息（硬删除）
     *
     * @param {Prisma.SysDeptDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysDeptDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysDept.deleteMany(options)
        return result

    }

    /**
     * 根据ID删除部门信息（软删除）
     *
     * @param {number} id 部门ID
     * @param {Omit<Prisma.SysDeptUpdateArgs, "where" | "data">} [options] 删除选项
     * @returns {Promise<Omit<SysDept, "deletedAt">>} 删除的部门
     */
    public async softDeleteById (
        id: number,
        options?: Omit<Prisma.SysDeptUpdateArgs, "where" | "data">
    ): Promise<Omit<SysDept, "deletedAt">> {

        const result = await this.sysDept.update({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                id
            },
            data: {
                deletedAt: BigInt(Date.now())
            },
            omit: {
                ...this.DEFAULT_OMIT,
                ...options?.omit
            }
        })
        return result

    }

    /**
     * 批量删除部门信息（软删除）
     *
     * @param {Omit<Prisma.SysDeptUpdateManyArgs, "data">} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async softDeleteMany (options?: Omit<Prisma.SysDeptUpdateManyArgs, "data">): Promise<Prisma.BatchPayload> {

        const result = await this.sysDept.updateMany({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                ...options?.where
            },
            data: {
                deletedAt: BigInt(Date.now())
            }
        })
        return result

    }

    /**
     * 根据ID校验部门是否存在
     *
     * @param {number} id 部门ID
     * @param {Omit<Prisma.SysDeptCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysDeptCountArgs, "where">): Promise<boolean> {

        const count = await this.sysDept.count({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                id
            }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验部门是否存在
     *
     * @param {Prisma.SysDeptCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysDeptCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysDeptCountArgs["where"],
        options?: Omit<Prisma.SysDeptCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysDept.count({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                ...where
            }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计部门数量
     *
     * @param {Prisma.SysDeptCountArgs} [options] 查询选项
     * @returns {Promise<number>} 部门数量
     */
    public async count (options?: Prisma.SysDeptCountArgs): Promise<number> {

        const result = await this.sysDept.count({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                ...options?.where
            }
        })
        return result

    }

}
