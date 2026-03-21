/*
 * @FileDesc: 用户岗位仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysUserPost, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 用户岗位仓储 */
@Injectable()
export class UserPostRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysUserPost () {

        return this.txHost.tx.sysUserPost

    }

    /**
     * 根据条件查询第一条用户岗位信息
     *
     * @param {Prisma.SysUserPostFindFirstArgs} [options] 查询选项
     * @returns {Promise<SysUserPost | null>} 用户岗位信息
     */
    public async findFirst (options?: Prisma.SysUserPostFindFirstArgs): Promise<SysUserPost | null> {

        const data = await this.sysUserPost.findFirst({
            ...options
        })
        return data

    }

    /**
     * 根据条件查询多条用户岗位信息
     *
     * @param {Prisma.SysUserPostFindManyArgs} [options] 查询选项
     * @returns {Promise<SysUserPost[]>} 用户岗位列表
     */
    public async findMany (options?: Prisma.SysUserPostFindManyArgs): Promise<SysUserPost[]> {

        const data = await this.sysUserPost.findMany({
            ...options
        })
        return data

    }

    /**
     * 根据条件分页查询用户岗位信息列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysUserPostFindManyArgs, "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysUserPost>>} 用户岗位列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysUserPostFindManyArgs, "skip" | "take">
    ): Promise<PaginationResponseDto<SysUserPost>> {

        const [list, total] = await Promise.all([
            this.sysUserPost.findMany({
                ...options,
                skip,
                take
            }),
            this.sysUserPost.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增用户岗位信息
     *
     * @param {Prisma.SysUserPostCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysUserPostCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysUserPost>} 新增的用户岗位
     */
    public async create (
        data: Prisma.SysUserPostCreateArgs["data"],
        options?: Omit<Prisma.SysUserPostCreateArgs, "data">
    ): Promise<SysUserPost> {

        const result = await this.sysUserPost.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增用户岗位信息
     *
     * @param {Prisma.SysUserPostCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysUserPostCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysUserPostCreateManyArgs["data"],
        options?: Omit<Prisma.SysUserPostCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysUserPost.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量修改用户岗位信息
     *
     * @param {Prisma.SysUserPostUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysUserPostUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysUserPostUpdateManyArgs["data"],
        options?: Omit<Prisma.SysUserPostUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysUserPost.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量删除用户岗位信息（硬删除）
     *
     * @param {Prisma.SysUserPostDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysUserPostDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysUserPost.deleteMany(options)
        return result

    }

    /**
     * 根据条件校验用户岗位是否存在
     *
     * @param {Prisma.SysUserPostCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysUserPostCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysUserPostCountArgs["where"],
        options?: Omit<Prisma.SysUserPostCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysUserPost.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计用户岗位数量
     *
     * @param {Prisma.SysUserPostCountArgs} [options] 查询选项
     * @returns {Promise<number>} 用户岗位数量
     */
    public async count (options?: Prisma.SysUserPostCountArgs): Promise<number> {

        const result = await this.sysUserPost.count(options)
        return result

    }

}
