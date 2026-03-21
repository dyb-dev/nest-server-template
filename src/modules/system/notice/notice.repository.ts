/*
 * @FileDesc: 通知公告仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysNotice, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 通知公告仓储 */
@Injectable()
export class NoticeRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysNotice () {

        return this.txHost.tx.sysNotice

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY: Prisma.SysNoticeOrderByWithRelationInput | Prisma.SysNoticeOrderByWithRelationInput[] = {
        createdAt: "desc"
    }

    /**
     * 根据 ID 查询通知公告
     *
     * @param {number} id 公告ID
     * @param {Omit<Prisma.SysNoticeFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysNotice | null>} 公告信息
     */
    public async findById (id: number, options?: Omit<Prisma.SysNoticeFindUniqueArgs, "where">): Promise<SysNotice | null> {

        const data = await this.sysNotice.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条通知公告
     *
     * @param {Omit<Prisma.SysNoticeFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysNotice | null>} 公告信息
     */
    public async findFirst (options?: Omit<Prisma.SysNoticeFindFirstArgs, "orderBy">): Promise<SysNotice | null> {

        const data = await this.sysNotice.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条通知公告
     *
     * @param {Omit<Prisma.SysNoticeFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysNotice[]>} 公告列表
     */
    public async findMany (options?: Omit<Prisma.SysNoticeFindManyArgs, "orderBy">): Promise<SysNotice[]> {

        const data = await this.sysNotice.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询通知公告列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysNoticeFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysNotice>>} 公告列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysNoticeFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysNotice>> {

        const [list, total] = await Promise.all([
            this.sysNotice.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysNotice.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增通知公告
     *
     * @param {Prisma.SysNoticeCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysNoticeCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysNotice>} 新增的公告
     */
    public async create (
        data: Prisma.SysNoticeCreateArgs["data"],
        options?: Omit<Prisma.SysNoticeCreateArgs, "data">
    ): Promise<SysNotice> {

        const result = await this.sysNotice.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增通知公告
     *
     * @param {Prisma.SysNoticeCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysNoticeCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysNoticeCreateManyArgs["data"],
        options?: Omit<Prisma.SysNoticeCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysNotice.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据 ID 修改通知公告
     *
     * @param {number} id 公告ID
     * @param {Prisma.SysNoticeUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysNoticeUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysNotice>} 更新后的公告
     */
    public async updateById (
        id: number,
        data: Prisma.SysNoticeUpdateArgs["data"],
        options?: Omit<Prisma.SysNoticeUpdateArgs, "where" | "data">
    ): Promise<SysNotice> {

        const result = await this.sysNotice.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改通知公告
     *
     * @param {Prisma.SysNoticeUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysNoticeUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysNoticeUpdateManyArgs["data"],
        options?: Omit<Prisma.SysNoticeUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysNotice.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据 ID 删除通知公告（硬删除）
     *
     * @param {number} id 公告ID
     * @param {Omit<Prisma.SysNoticeDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysNotice>} 删除的公告
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysNoticeDeleteArgs, "where">): Promise<SysNotice> {

        const result = await this.sysNotice.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除通知公告（硬删除）
     *
     * @param {Prisma.SysNoticeDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysNoticeDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysNotice.deleteMany(options)
        return result

    }

    /**
     * 根据 ID 校验通知公告是否存在
     *
     * @param {number} id 公告ID
     * @param {Omit<Prisma.SysNoticeCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysNoticeCountArgs, "where">): Promise<boolean> {

        const count = await this.sysNotice.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验通知公告是否存在
     *
     * @param {Prisma.SysNoticeCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysNoticeCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysNoticeCountArgs["where"],
        options?: Omit<Prisma.SysNoticeCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysNotice.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计通知公告数量
     *
     * @param {Prisma.SysNoticeCountArgs} [options] 查询选项
     * @returns {Promise<number>} 公告数量
     */
    public async count (options?: Prisma.SysNoticeCountArgs): Promise<number> {

        const result = await this.sysNotice.count(options)
        return result

    }

}
