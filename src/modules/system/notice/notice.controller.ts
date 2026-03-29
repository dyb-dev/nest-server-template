/*
 * @FileDesc: 通知公告控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission, User } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"

import {
    CreateRequestDto,
    UpdateRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./notice.dto"
import { NoticeService } from "./notice.service"

import type { SysNotice } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 通知公告控制器 */
@Controller("notice")
export class NoticeController {

    /** 日志记录器 */
    @InjectPinoLogger(NoticeController.name)
    private readonly logger: PinoLogger

    /** 通知公告服务 */
    @Inject(NoticeService)
    private readonly noticeService: NoticeService

    /**
     * 获取通知公告列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysNotice[]>} 公告列表
     */
    @Permission("system:notice:read")
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysNotice[]> {

        this.logger.info("[getList] started")
        const data = await this.noticeService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页通知公告列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysNotice>>} 公告列表和总数
     */
    @Permission("system:notice:read")
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysNotice>> {

        this.logger.info("[getPageList] started")
        const data = await this.noticeService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取通知公告详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<SysNotice>} 公告详情
     */
    @Permission("system:notice:read")
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<SysNotice> {

        this.logger.info("[getDetail] started")
        const data = await this.noticeService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建通知公告
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:notice:create")
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.noticeService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新通知公告
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:notice:update")
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.noticeService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 删除通知公告
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:notice:delete")
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.noticeService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除通知公告
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:notice:delete")
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.noticeService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

}
