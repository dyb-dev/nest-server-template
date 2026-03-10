/*
 * @FileDesc: 用户仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysUser, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 用户仓储 */
@Injectable()
export class UserRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysUser () {

        return this.txHost.tx.sysUser

    }

    /** 默认查询条件 */
    private readonly DEFAULT_WHERE: Prisma.SysUserWhereInput = { deletedAt: 0 }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysUserOrderByWithRelationInput | Prisma.SysUserOrderByWithRelationInput[] = {
        createdAt: "desc"
    }

    /** 默认排除字段 */
    private readonly DEFAULT_OMIT: Prisma.SysUserOmit = {
        password: true,
        deletedAt: true
    }

    /**
     * 根据ID查询用户信息
     *
     * @param {number} id 用户ID
     * @param {Omit<Prisma.SysUserFindUniqueArgs, "where">} options 查询选项
     * @returns {Promise<Omit<SysUser, 'deletedAt'>  | null>} 用户信息
     */
    public async findById (
        id: number,
        options?: Omit<Prisma.SysUserFindUniqueArgs, "where">
    ): Promise<Omit<SysUser, "deletedAt"> | null> {

        const data = await this.sysUser.findUnique({
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
     * 根据条件查询第一条用户信息
     *
     * @param {Omit<Prisma.SysUserFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<Omit<SysUser, 'deletedAt'>  | null>} 用户信息
     */
    public async findFirst (options?: Omit<Prisma.SysUserFindFirstArgs, "orderBy">): Promise<Omit<SysUser, "deletedAt"> | null> {

        const data = await this.sysUser.findFirst({
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
     * 根据条件查询多条用户信息
     *
     * @param {Omit<Prisma.SysUserFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<Omit<SysUser, 'password' | 'deletedAt'> []>} 用户列表
     */
    public async findMany (
        options?: Omit<Prisma.SysUserFindManyArgs, "orderBy">
    ): Promise<Omit<SysUser, "password" | "deletedAt">[]> {

        const data = await this.sysUser.findMany({
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
     * 根据条件分页查询用户信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysUserFindManyArgs, "orderBy"|"skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<Omit<SysUser, 'password' | 'deletedAt'> >>} 用户列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysUserFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>> {

        const finalWhere: Prisma.SysUserWhereInput = {
            ...this.DEFAULT_WHERE,
            ...options?.where
        }
        const [list, total] = await Promise.all([
            this.sysUser.findMany({
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
            this.sysUser.count({ where: finalWhere })
        ])
        return { list, total }

    }

    /**
     * 新增用户信息
     *
     * @param {Prisma.SysUserCreateArgs['data']} data 创建数据
     * @param {Omit<Prisma.SysUserCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<Omit<SysUser, 'password' | 'deletedAt'> >} 新增的用户
     */
    public async create (
        data: Prisma.SysUserCreateArgs["data"],
        options?: Omit<Prisma.SysUserCreateArgs, "data">
    ): Promise<Omit<SysUser, "password" | "deletedAt">> {

        const result = await this.sysUser.create({
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
     * 批量新增用户信息
     *
     * @param {Prisma.SysUserCreateManyArgs['data']} data 创建数据
     * @param {Omit<Prisma.SysUserCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysUserCreateManyArgs["data"],
        options?: Omit<Prisma.SysUserCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysUser.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改用户信息
     *
     * @param {number} id 用户ID
     * @param {Prisma.SysUserUpdateArgs['data']} data 更新数据
     * @param {Omit<Prisma.SysUserUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<Omit<SysUser, 'password' | 'deletedAt'> >} 更新后的用户
     */
    public async updateById (
        id: number,
        data: Prisma.SysUserUpdateArgs["data"],
        options?: Omit<Prisma.SysUserUpdateArgs, "where" | "data">
    ): Promise<Omit<SysUser, "password" | "deletedAt">> {

        const result = await this.sysUser.update({
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
     * 批量修改用户信息
     *
     * @param {Prisma.SysUserUpdateManyArgs['data']} data 更新数据
     * @param {Omit<Prisma.SysUserUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysUserUpdateManyArgs["data"],
        options?: Omit<Prisma.SysUserUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysUser.updateMany({
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
     * 根据ID删除用户信息（硬删除）
     *
     * @param {number} id 用户ID
     * @param {Omit<Prisma.SysUserDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<Omit<SysUser, 'password' | 'deletedAt'> >} 删除的用户
     */
    public async deleteById (
        id: number,
        options?: Omit<Prisma.SysUserDeleteArgs, "where">
    ): Promise<Omit<SysUser, "password" | "deletedAt">> {

        const result = await this.sysUser.delete({
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
     * 批量删除用户信息（硬删除）
     *
     * @param {Omit<Prisma.SysUserDeleteManyArgs, "where">} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysUserDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysUser.deleteMany(options)
        return result

    }

    /**
     * 根据ID删除用户信息（软删除）
     *
     * @param {number} id 用户ID
     * @param {Omit<Prisma.SysUserUpdateArgs, "where" | "data">} [options] 删除选项
     * @returns {Promise<Omit<SysUser, 'password' | 'deletedAt'> >} 删除的用户
     */
    public async softDeleteById (
        id: number,
        options?: Omit<Prisma.SysUserUpdateArgs, "where" | "data">
    ): Promise<Omit<SysUser, "password" | "deletedAt">> {

        const result = await this.sysUser.update({
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
     * 批量删除用户信息（软删除）
     *
     * @param {Omit<Prisma.SysUserUpdateManyArgs, "data">} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async softDeleteMany (options?: Omit<Prisma.SysUserUpdateManyArgs, "data">): Promise<Prisma.BatchPayload> {

        const result = await this.sysUser.updateMany({
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
     * 根据ID校验用户是否存在
     *
     * @param {number} id 用户ID
     * @param {Omit<Prisma.SysUserCountArgs, "where">} options 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysUserCountArgs, "where">): Promise<boolean> {

        const count = await this.sysUser.count({
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
     * 根据条件校验用户是否存在
     *
     * @param {Prisma.SysUserCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysUserCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysUserCountArgs["where"],
        options?: Omit<Prisma.SysUserCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysUser.count({
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
     * 统计用户数量
     *
     * @param {Omit<Prisma.SysUserCountArgs, "where">} [options] 查询选项
     * @returns {Promise<number>} 用户数量
     */
    public async count (options?: Prisma.SysUserCountArgs): Promise<number> {

        const result = await this.sysUser.count({
            ...options,
            where: {
                ...this.DEFAULT_WHERE,
                ...options?.where
            }
        })
        return result

    }

}
