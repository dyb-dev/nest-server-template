/*
 * @FileDesc: 菜单仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysMenu, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 菜单仓储 */
@Injectable()
export class MenuRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysMenu () {

        return this.txHost.tx.sysMenu

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysMenuOrderByWithRelationInput | Prisma.SysMenuOrderByWithRelationInput[] = [
        { sort: "asc" },
        { createdAt: "desc" }
    ]

    /**
     * 根据ID查询菜单信息
     *
     * @param {number} id 菜单ID
     * @param {Omit<Prisma.SysMenuFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysMenu | null>} 菜单信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysMenuFindUniqueArgs, "where">): Promise<SysMenu | null> {

        const data = await this.sysMenu.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条菜单信息
     *
     * @param {Omit<Prisma.SysMenuFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysMenu | null>} 菜单信息
     */
    public async findFirst (options?: Omit<Prisma.SysMenuFindFirstArgs, "orderBy">): Promise<SysMenu | null> {

        const data = await this.sysMenu.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条菜单信息
     *
     * @param {Omit<Prisma.SysMenuFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysMenu[]>} 菜单列表
     */
    public async findMany (options?: Omit<Prisma.SysMenuFindManyArgs, "orderBy">): Promise<SysMenu[]> {

        const data = await this.sysMenu.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询菜单信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysMenuFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysMenu>>} 菜单列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysMenuFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysMenu>> {

        const [list, total] = await Promise.all([
            this.sysMenu.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysMenu.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增菜单信息
     *
     * @param {Prisma.SysMenuCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysMenuCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysMenu>} 新增的菜单
     */
    public async create (
        data: Prisma.SysMenuCreateArgs["data"],
        options?: Omit<Prisma.SysMenuCreateArgs, "data">
    ): Promise<SysMenu> {

        const result = await this.sysMenu.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增菜单信息
     *
     * @param {Prisma.SysMenuCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysMenuCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysMenuCreateManyArgs["data"],
        options?: Omit<Prisma.SysMenuCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysMenu.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID修改菜单信息
     *
     * @param {number} id 菜单ID
     * @param {Prisma.SysMenuUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysMenuUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysMenu>} 更新后的菜单
     */
    public async updateById (
        id: number,
        data: Prisma.SysMenuUpdateArgs["data"],
        options?: Omit<Prisma.SysMenuUpdateArgs, "where" | "data">
    ): Promise<SysMenu> {

        const result = await this.sysMenu.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改菜单信息
     *
     * @param {Prisma.SysMenuUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysMenuUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysMenuUpdateManyArgs["data"],
        options?: Omit<Prisma.SysMenuUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysMenu.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据ID删除菜单信息（硬删除）
     *
     * @param {number} id 菜单ID
     * @param {Omit<Prisma.SysMenuDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysMenu>} 删除的菜单
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysMenuDeleteArgs, "where">): Promise<SysMenu> {

        const result = await this.sysMenu.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除菜单信息（硬删除）
     *
     * @param {Prisma.SysMenuDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysMenuDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysMenu.deleteMany(options)
        return result

    }

    /**
     * 根据ID校验菜单是否存在
     *
     * @param {number} id 菜单ID
     * @param {Omit<Prisma.SysMenuCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysMenuCountArgs, "where">): Promise<boolean> {

        const count = await this.sysMenu.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验菜单是否存在
     *
     * @param {Prisma.SysMenuCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysMenuCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysMenuCountArgs["where"],
        options?: Omit<Prisma.SysMenuCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysMenu.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计菜单数量
     *
     * @param {Prisma.SysMenuCountArgs} [options] 查询选项
     * @returns {Promise<number>} 菜单数量
     */
    public async count (options?: Prisma.SysMenuCountArgs): Promise<number> {

        const result = await this.sysMenu.count(options)
        return result

    }

}
