/*
 * @FileDesc: 角色菜单仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysRoleMenu, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 角色菜单仓储 */
@Injectable()
export class RoleMenuRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysRoleMenu () {

        return this.txHost.tx.sysRoleMenu

    }

    /**
     * 根据条件查询第一条角色菜单信息
     *
     * @param {Prisma.SysRoleMenuFindFirstArgs} [options] 查询选项
     * @returns {Promise<SysRoleMenu | null>} 角色菜单信息
     */
    public async findFirst (options?: Prisma.SysRoleMenuFindFirstArgs): Promise<SysRoleMenu | null> {

        const data = await this.sysRoleMenu.findFirst({
            ...options
        })
        return data

    }

    /**
     * 根据条件查询多条角色菜单信息
     *
     * @param {Prisma.SysRoleMenuFindManyArgs} [options] 查询选项
     * @returns {Promise<SysRoleMenu[]>} 角色菜单列表
     */
    public async findMany (options?: Prisma.SysRoleMenuFindManyArgs): Promise<SysRoleMenu[]> {

        const data = await this.sysRoleMenu.findMany({
            ...options
        })
        return data

    }

    /**
     * 根据条件分页查询角色菜单信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysRoleMenuFindManyArgs, "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysRoleMenu>>} 角色菜单列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysRoleMenuFindManyArgs, "skip" | "take">
    ): Promise<PaginationResponseDto<SysRoleMenu>> {

        const [list, total] = await Promise.all([
            this.sysRoleMenu.findMany({
                ...options,
                skip,
                take
            }),
            this.sysRoleMenu.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增角色菜单信息
     *
     * @param {Prisma.SysRoleMenuCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysRoleMenuCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysRoleMenu>} 新增的角色菜单
     */
    public async create (
        data: Prisma.SysRoleMenuCreateArgs["data"],
        options?: Omit<Prisma.SysRoleMenuCreateArgs, "data">
    ): Promise<SysRoleMenu> {

        const result = await this.sysRoleMenu.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增角色菜单信息
     *
     * @param {Prisma.SysRoleMenuCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysRoleMenuCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysRoleMenuCreateManyArgs["data"],
        options?: Omit<Prisma.SysRoleMenuCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysRoleMenu.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量修改角色菜单信息
     *
     * @param {Prisma.SysRoleMenuUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysRoleMenuUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysRoleMenuUpdateManyArgs["data"],
        options?: Omit<Prisma.SysRoleMenuUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysRoleMenu.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量删除角色菜单信息（硬删除）
     *
     * @param {Prisma.SysRoleMenuDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysRoleMenuDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysRoleMenu.deleteMany(options)
        return result

    }

    /**
     * 根据条件校验角色菜单是否存在
     *
     * @param {Prisma.SysRoleMenuCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysRoleMenuCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysRoleMenuCountArgs["where"],
        options?: Omit<Prisma.SysRoleMenuCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysRoleMenu.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计角色菜单数量
     *
     * @param {Prisma.SysRoleMenuCountArgs} [options] 查询选项
     * @returns {Promise<number>} 角色菜单数量
     */
    public async count (options?: Prisma.SysRoleMenuCountArgs): Promise<number> {

        const result = await this.sysRoleMenu.count(options)
        return result

    }

}
