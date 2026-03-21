/*
 * @FileDesc: 角色部门仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysRoleDept, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 角色部门仓储 */
@Injectable()
export class RoleDeptRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysRoleDept () {

        return this.txHost.tx.sysRoleDept

    }

    /**
     * 根据条件查询第一条角色部门信息
     *
     * @param {Prisma.SysRoleDeptFindFirstArgs} [options] 查询选项
     * @returns {Promise<SysRoleDept | null>} 角色部门信息
     */
    public async findFirst (options?: Prisma.SysRoleDeptFindFirstArgs): Promise<SysRoleDept | null> {

        const data = await this.sysRoleDept.findFirst({
            ...options
        })
        return data

    }

    /**
     * 根据条件查询多条角色部门信息
     *
     * @param {Prisma.SysRoleDeptFindManyArgs} [options] 查询选项
     * @returns {Promise<SysRoleDept[]>} 角色部门列表
     */
    public async findMany (options?: Prisma.SysRoleDeptFindManyArgs): Promise<SysRoleDept[]> {

        const data = await this.sysRoleDept.findMany({
            ...options
        })
        return data

    }

    /**
     * 根据条件分页查询角色部门信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysRoleDeptFindManyArgs, "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysRoleDept>>} 角色部门列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysRoleDeptFindManyArgs, "skip" | "take">
    ): Promise<PaginationResponseDto<SysRoleDept>> {

        const [list, total] = await Promise.all([
            this.sysRoleDept.findMany({
                ...options,
                skip,
                take
            }),
            this.sysRoleDept.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增角色部门信息
     *
     * @param {Prisma.SysRoleDeptCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysRoleDeptCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysRoleDept>} 新增的角色部门
     */
    public async create (
        data: Prisma.SysRoleDeptCreateArgs["data"],
        options?: Omit<Prisma.SysRoleDeptCreateArgs, "data">
    ): Promise<SysRoleDept> {

        const result = await this.sysRoleDept.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增角色部门信息
     *
     * @param {Prisma.SysRoleDeptCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysRoleDeptCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysRoleDeptCreateManyArgs["data"],
        options?: Omit<Prisma.SysRoleDeptCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysRoleDept.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量修改角色部门信息
     *
     * @param {Prisma.SysRoleDeptUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysRoleDeptUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysRoleDeptUpdateManyArgs["data"],
        options?: Omit<Prisma.SysRoleDeptUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysRoleDept.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量删除角色部门信息（硬删除）
     *
     * @param {Prisma.SysRoleDeptDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysRoleDeptDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysRoleDept.deleteMany(options)
        return result

    }

    /**
     * 根据条件校验角色部门是否存在
     *
     * @param {Prisma.SysRoleDeptCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysRoleDeptCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysRoleDeptCountArgs["where"],
        options?: Omit<Prisma.SysRoleDeptCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysRoleDept.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计角色部门数量
     *
     * @param {Prisma.SysRoleDeptCountArgs} [options] 查询选项
     * @returns {Promise<number>} 角色部门数量
     */
    public async count (options?: Prisma.SysRoleDeptCountArgs): Promise<number> {

        const result = await this.sysRoleDept.count(options)
        return result

    }

}
