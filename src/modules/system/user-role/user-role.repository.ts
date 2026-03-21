/*
 * @FileDesc: 用户角色仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysUserRole, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 用户角色仓储 */
@Injectable()
export class UserRoleRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysUserRole () {

        return this.txHost.tx.sysUserRole

    }

    /**
     * 根据条件查询第一条用户角色信息
     *
     * @param {Prisma.SysUserRoleFindFirstArgs} [options] 查询选项
     * @returns {Promise<SysUserRole | null>} 用户角色信息
     */
    public async findFirst (options?: Prisma.SysUserRoleFindFirstArgs): Promise<SysUserRole | null> {

        const data = await this.sysUserRole.findFirst({
            ...options
        })
        return data

    }

    /**
     * 根据条件查询多条用户角色信息
     *
     * @param {Prisma.SysUserRoleFindManyArgs} [options] 查询选项
     * @returns {Promise<SysUserRole[]>} 用户角色列表
     */
    public async findMany (options?: Prisma.SysUserRoleFindManyArgs): Promise<SysUserRole[]> {

        const data = await this.sysUserRole.findMany({
            ...options
        })
        return data

    }

    /**
     * 根据条件分页查询用户角色信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysUserRoleFindManyArgs, "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysUserRole>>} 用户角色列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysUserRoleFindManyArgs, "skip" | "take">
    ): Promise<PaginationResponseDto<SysUserRole>> {

        const [list, total] = await Promise.all([
            this.sysUserRole.findMany({
                ...options,
                skip,
                take
            }),
            this.sysUserRole.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增用户角色信息
     *
     * @param {Prisma.SysUserRoleCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysUserRoleCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysUserRole>} 新增的用户角色
     */
    public async create (
        data: Prisma.SysUserRoleCreateArgs["data"],
        options?: Omit<Prisma.SysUserRoleCreateArgs, "data">
    ): Promise<SysUserRole> {

        const result = await this.sysUserRole.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增用户角色信息
     *
     * @param {Prisma.SysUserRoleCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysUserRoleCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysUserRoleCreateManyArgs["data"],
        options?: Omit<Prisma.SysUserRoleCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysUserRole.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量修改用户角色信息
     *
     * @param {Prisma.SysUserRoleUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysUserRoleUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysUserRoleUpdateManyArgs["data"],
        options?: Omit<Prisma.SysUserRoleUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysUserRole.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量删除用户角色信息（硬删除）
     *
     * @param {Prisma.SysUserRoleDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysUserRoleDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysUserRole.deleteMany(options)
        return result

    }

    /**
     * 根据条件校验用户角色是否存在
     *
     * @param {Prisma.SysUserRoleCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysUserRoleCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysUserRoleCountArgs["where"],
        options?: Omit<Prisma.SysUserRoleCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysUserRole.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计用户角色数量
     *
     * @param {Prisma.SysUserRoleCountArgs} [options] 查询选项
     * @returns {Promise<number>} 用户角色数量
     */
    public async count (options?: Prisma.SysUserRoleCountArgs): Promise<number> {

        const result = await this.sysUserRole.count(options)
        return result

    }

}
