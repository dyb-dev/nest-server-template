/*
 * @FileDesc: 角色仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysRole, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 角色仓储 */
@Injectable()
export class RoleRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysRole () {

        return this.txHost.tx.sysRole

    }

    /** 默认查询条件 */
    private readonly DEFAULT_WHERE: Prisma.SysRoleWhereInput = { deletedAt: 0 }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysRoleOrderByWithRelationInput | Prisma.SysRoleOrderByWithRelationInput[] = [
        { sort: "asc" },
        { createdAt: "desc" }
    ]

    /** 默认排除字段 */
    private readonly DEFAULT_OMIT: Prisma.SysRoleOmit = {
        deletedAt: true
    }

    /**
     * 根据ID查询角色信息
     *
     * @param {number} id 角色ID
     * @param {Omit<Prisma.SysRoleFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<Omit<SysRole, "deletedAt"> | null>} 角色信息
     */
    public async findById (
        id: number,
        options?: Omit<Prisma.SysRoleFindUniqueArgs, "where">
    ): Promise<Omit<SysRole, "deletedAt"> | null> {

        const data = await this.sysRole.findUnique({
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
     * 根据条件查询第一条角色信息
     *
     * @param {Omit<Prisma.SysRoleFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<Omit<SysRole, "deletedAt"> | null>} 角色信息
     */
    public async findFirst (options?: Omit<Prisma.SysRoleFindFirstArgs, "orderBy">): Promise<Omit<SysRole, "deletedAt"> | null> {

        const data = await this.sysRole.findFirst({
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
     * 根据条件查询多条角色信息
     *
     * @param {Omit<Prisma.SysRoleFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<Omit<SysRole, "deletedAt">[]>} 角色列表
     */
    public async findMany (options?: Omit<Prisma.SysRoleFindManyArgs, "orderBy">): Promise<Omit<SysRole, "deletedAt">[]> {

        const data = await this.sysRole.findMany({
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
     * 根据条件分页查询角色信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysRoleFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<Omit<SysRole, "deletedAt">>>} 角色列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysRoleFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<Omit<SysRole, "deletedAt">>> {

        const finalWhere: Prisma.SysRoleWhereInput = {
            ...this.DEFAULT_WHERE,
            ...options?.where
        }
        const [list, total] = await Promise.all([
            this.sysRole.findMany({
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
            this.sysRole.count({ where: finalWhere })
        ])
        return { list, total }

    }

    /**
     * 新增角色信息
     *
     * @param {Prisma.SysRoleCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysRoleCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<Omit<SysRole, "deletedAt">>} 新增的角色
     */
    public async create (
        data: Prisma.SysRoleCreateArgs["data"],
        options?: Omit<Prisma.SysRoleCreateArgs, "data">
    ): Promise<Omit<SysRole, "deletedAt">> {

        const result = await this.sysRole.create({
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
     * 批量新增角色信息
     *
     * @param {Prisma.SysRoleCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysRoleCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysRoleCreateManyArgs["data"],
        options?: Omit<Prisma.SysRoleCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysRole.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改角色信息
     *
     * @param {number} id 角色ID
     * @param {Prisma.SysRoleUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysRoleUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<Omit<SysRole, "deletedAt">>} 更新后的角色
     */
    public async updateById (
        id: number,
        data: Prisma.SysRoleUpdateArgs["data"],
        options?: Omit<Prisma.SysRoleUpdateArgs, "where" | "data">
    ): Promise<Omit<SysRole, "deletedAt">> {

        const result = await this.sysRole.update({
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
     * 批量修改角色信息
     *
     * @param {Prisma.SysRoleUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysRoleUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysRoleUpdateManyArgs["data"],
        options?: Omit<Prisma.SysRoleUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysRole.updateMany({
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
     * 根据ID删除角色信息（硬删除）
     *
     * @param {number} id 角色ID
     * @param {Omit<Prisma.SysRoleDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<Omit<SysRole, "deletedAt">>} 删除的角色
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysRoleDeleteArgs, "where">): Promise<Omit<SysRole, "deletedAt">> {

        const result = await this.sysRole.delete({
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
     * 批量删除角色信息（硬删除）
     *
     * @param {Prisma.SysRoleDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysRoleDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysRole.deleteMany(options)
        return result

    }

    /**
     * 根据ID删除角色信息（软删除）
     *
     * @param {number} id 角色ID
     * @param {Omit<Prisma.SysRoleUpdateArgs, "where" | "data">} [options] 删除选项
     * @returns {Promise<Omit<SysRole, "deletedAt">>} 删除的角色
     */
    public async softDeleteById (
        id: number,
        options?: Omit<Prisma.SysRoleUpdateArgs, "where" | "data">
    ): Promise<Omit<SysRole, "deletedAt">> {

        const result = await this.sysRole.update({
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
     * 批量删除角色信息（软删除）
     *
     * @param {Omit<Prisma.SysRoleUpdateManyArgs, "data">} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async softDeleteMany (options?: Omit<Prisma.SysRoleUpdateManyArgs, "data">): Promise<Prisma.BatchPayload> {

        const result = await this.sysRole.updateMany({
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
     * 根据ID校验角色是否存在
     *
     * @param {number} id 角色ID
     * @param {Omit<Prisma.SysRoleCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysRoleCountArgs, "where">): Promise<boolean> {

        const count = await this.sysRole.count({
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
     * 根据条件校验角色是否存在
     *
     * @param {Prisma.SysRoleCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysRoleCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysRoleCountArgs["where"],
        options?: Omit<Prisma.SysRoleCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysRole.count({
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
     * 统计角色数量
     *
     * @param {Prisma.SysRoleCountArgs} [options] 查询选项
     * @returns {Promise<number>} 角色数量
     */
    public async count (options?: Prisma.SysRoleCountArgs): Promise<number> {

        const result = await this.sysRole.count({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                ...options?.where
            }
        })
        return result

    }

}
