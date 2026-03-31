/*
 * @FileDesc: 登录会话仓储
 */

import { Injectable } from "@nestjs/common"
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional"

import { PaginationResponseDto } from "@/dtos"

import { DatabaseService } from "../../core"

import type { SysLoginSession, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"

/** 登录会话仓储 */
@Injectable()
export class LoginSessionRepository {

    /** 事务上下文 */
    @InjectTransactionHost()
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<DatabaseService>>

    private get sysLoginSession () {

        return this.txHost.tx.sysLoginSession

    }

    /** 默认排序规则 */
    private readonly DEFAULT_ORDER_BY:
        | Prisma.SysLoginSessionOrderByWithRelationInput
        | Prisma.SysLoginSessionOrderByWithRelationInput[] = {
            loginAt: "desc"
        }

    /**
     * 根据 ID 查询登录会话
     *
     * @param {number} id 会话ID
     * @param {Omit<Prisma.SysLoginSessionFindUniqueArgs, "where">} [options] 查询选项
     * @returns {Promise<SysLoginSession | null>} 会话信息
     */
    public async findById (
        id: number,
        options?: Omit<Prisma.SysLoginSessionFindUniqueArgs, "where">
    ): Promise<SysLoginSession | null> {

        const data = await this.sysLoginSession.findUnique({
            ...options,
            where: { id }
        })
        return data

    }

    /**
     * 根据条件查询第一条登录会话
     *
     * @param {Omit<Prisma.SysLoginSessionFindFirstArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysLoginSession | null>} 会话信息
     */
    public async findFirst (options?: Omit<Prisma.SysLoginSessionFindFirstArgs, "orderBy">): Promise<SysLoginSession | null> {

        const data = await this.sysLoginSession.findFirst({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件查询多条登录会话
     *
     * @param {Omit<Prisma.SysLoginSessionFindManyArgs, "orderBy">} [options] 查询选项
     * @returns {Promise<SysLoginSession[]>} 会话列表
     */
    public async findMany (options?: Omit<Prisma.SysLoginSessionFindManyArgs, "orderBy">): Promise<SysLoginSession[]> {

        const data = await this.sysLoginSession.findMany({
            ...options,
            orderBy: this.DEFAULT_ORDER_BY
        })
        return data

    }

    /**
     * 根据条件分页查询登录会话列表
     *
     * @param {number} skip 跳过数量
     * @param {number} take 获取数量
     * @param {Omit<Prisma.SysLoginSessionFindManyArgs, "orderBy" | "skip" | "take">} [options] 查询选项
     * @returns {Promise<PaginationResponseDto<SysLoginSession>>} 会话列表和总数
     */
    public async findManyByPage (
        skip: number,
        take: number,
        options?: Omit<Prisma.SysLoginSessionFindManyArgs, "orderBy" | "skip" | "take">
    ): Promise<PaginationResponseDto<SysLoginSession>> {

        const [list, total] = await Promise.all([
            this.sysLoginSession.findMany({
                ...options,
                orderBy: this.DEFAULT_ORDER_BY,
                skip,
                take
            }),
            this.sysLoginSession.count({ where: options?.where })
        ])
        return { list, total }

    }

    /**
     * 新增登录会话
     *
     * @param {Prisma.SysLoginSessionCreateArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysLoginSessionCreateArgs, "data">} [options] 创建选项
     * @returns {Promise<SysLoginSession>} 新增的会话
     */
    public async create (
        data: Prisma.SysLoginSessionCreateArgs["data"],
        options?: Omit<Prisma.SysLoginSessionCreateArgs, "data">
    ): Promise<SysLoginSession> {

        const result = await this.sysLoginSession.create({
            ...options,
            data
        })
        return result

    }

    /**
     * 批量新增登录会话
     *
     * @param {Prisma.SysLoginSessionCreateManyArgs["data"]} data 创建数据
     * @param {Omit<Prisma.SysLoginSessionCreateManyArgs, "data">} [options] 创建选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async createMany (
        data: Prisma.SysLoginSessionCreateManyArgs["data"],
        options?: Omit<Prisma.SysLoginSessionCreateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysLoginSession.createMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据 ID 修改登录会话
     *
     * @param {number} id 会话ID
     * @param {Prisma.SysLoginSessionUpdateArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysLoginSessionUpdateArgs, "where" | "data">} [options] 更新选项
     * @returns {Promise<SysLoginSession>} 更新后的会话
     */
    public async updateById (
        id: number,
        data: Prisma.SysLoginSessionUpdateArgs["data"],
        options?: Omit<Prisma.SysLoginSessionUpdateArgs, "where" | "data">
    ): Promise<SysLoginSession> {

        const result = await this.sysLoginSession.update({
            ...options,
            where: { id },
            data
        })
        return result

    }

    /**
     * 批量修改登录会话
     *
     * @param {Prisma.SysLoginSessionUpdateManyArgs["data"]} data 更新数据
     * @param {Omit<Prisma.SysLoginSessionUpdateManyArgs, "data">} [options] 更新选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async updateMany (
        data: Prisma.SysLoginSessionUpdateManyArgs["data"],
        options?: Omit<Prisma.SysLoginSessionUpdateManyArgs, "data">
    ): Promise<Prisma.BatchPayload> {

        const result = await this.sysLoginSession.updateMany({
            ...options,
            data
        })
        return result

    }

    /**
     * 根据 ID 删除登录会话（硬删除）
     *
     * @param {number} id 会话ID
     * @param {Omit<Prisma.SysLoginSessionDeleteArgs, "where">} [options] 删除选项
     * @returns {Promise<SysLoginSession>} 删除的会话
     */
    public async deleteById (id: number, options?: Omit<Prisma.SysLoginSessionDeleteArgs, "where">): Promise<SysLoginSession> {

        const result = await this.sysLoginSession.delete({
            ...options,
            where: { id }
        })
        return result

    }

    /**
     * 批量删除登录会话（硬删除）
     *
     * @param {Prisma.SysLoginSessionDeleteManyArgs} [options] 删除选项
     * @returns {Promise<Prisma.BatchPayload>} 批量操作结果
     */
    public async deleteMany (options?: Prisma.SysLoginSessionDeleteManyArgs): Promise<Prisma.BatchPayload> {

        const result = await this.sysLoginSession.deleteMany(options)
        return result

    }

    /**
     * 根据 ID 校验登录会话是否存在
     *
     * @param {number} id 会话ID
     * @param {Omit<Prisma.SysLoginSessionCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsById (id: number, options?: Omit<Prisma.SysLoginSessionCountArgs, "where">): Promise<boolean> {

        const count = await this.sysLoginSession.count({
            ...options,
            where: { id }
        })
        const exists = count > 0
        return exists

    }

    /**
     * 根据条件校验登录会话是否存在
     *
     * @param {Prisma.SysLoginSessionCountArgs["where"]} where 查询条件
     * @param {Omit<Prisma.SysLoginSessionCountArgs, "where">} [options] 查询选项
     * @returns {Promise<boolean>} 是否存在
     */
    public async exists (
        where: Prisma.SysLoginSessionCountArgs["where"],
        options?: Omit<Prisma.SysLoginSessionCountArgs, "where">
    ): Promise<boolean> {

        const count = await this.sysLoginSession.count({
            ...options,
            where
        })
        const exists = count > 0
        return exists

    }

    /**
     * 统计登录会话数量
     *
     * @param {Prisma.SysLoginSessionCountArgs} [options] 查询选项
     * @returns {Promise<number>} 会话数量
     */
    public async count (options?: Prisma.SysLoginSessionCountArgs): Promise<number> {

        const result = await this.sysLoginSession.count(options)
        return result

    }

}
