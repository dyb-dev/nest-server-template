/*
 * @FileDesc: 通知公告服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"

import {
    CreateRequestDto,
    UpdateRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./notice.dto"
import { NoticeRepository } from "./notice.repository"

import type { SysNotice, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 通知公告服务 */
@Injectable()
export class NoticeService {

    /** 日志记录器 */
    @InjectPinoLogger(NoticeService.name)
    private readonly logger: PinoLogger

    /** 通知公告仓储 */
    @Inject(NoticeRepository)
    private readonly noticeRepository: NoticeRepository

    /**
     * 获取通知公告列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysNotice[]>} 公告列表
     */
    public async getList (params: GetListRequestDto): Promise<SysNotice[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.noticeRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页通知公告列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysNotice>>} 公告列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysNotice>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.noticeRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取通知公告详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<SysNotice>} 公告详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<SysNotice> {

        this.logger.info("[getDetail] started")

        const data = await this.checkNoticeExists(params.id)

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建通知公告
     *
     * @param {CreateRequestDto} params 创建参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        const createData: Prisma.SysNoticeCreateArgs["data"] = {
            ...params,
            createdBy: user?.username
        }

        await this.noticeRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 更新通知公告
     *
     * @param {UpdateRequestDto} params 更新参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        await this.checkNoticeExists(params.id)

        const { id, ...updateData } = params

        await this.noticeRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 删除通知公告
     *
     * @param {DeleteRequestDto} params 删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        await this.checkNoticeExists(params.id)
        await this.noticeRepository.deleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除通知公告
     *
     * @param {BatchDeleteRequestDto} params 批量删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const notices = await this.noticeRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (notices.length !== params.ids.length) {

            throw new BusinessLogicException("部分公告不存在")

        }

        await this.noticeRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysNoticeWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysNoticeWhereInput {

        const { title, type, isActive } = params

        return {
            ...title && { title: { contains: title } },
            ...type && { type },
            ...isActive !== void 0 && { isActive }
        }

    }

    /**
     * 检查通知公告是否存在
     *
     * @param {number} id 公告ID
     * @returns {Promise<SysNotice>} 公告信息
     * @throws {BusinessLogicException} 公告不存在时抛出异常
     */
    private async checkNoticeExists (id: number): Promise<SysNotice> {

        const notice = await this.noticeRepository.findById(id)
        if (!notice) {

            throw new BusinessLogicException("通知公告不存在")

        }
        return notice

    }

}
