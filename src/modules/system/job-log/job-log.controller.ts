/*
 * @FileDesc: 定时任务日志控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"

import { BatchDeleteRequestDto, GetListRequestDto, GetPageListRequestDto } from "./job-log.dto"
import { JobLogService } from "./job-log.service"

import type { SysJobLog } from "@/prisma/client"
import type { PinoLogger } from "nestjs-pino"

/** 定时任务日志控制器 */
@Controller("job-log")
export class JobLogController {

    /** 日志记录器 */
    @InjectPinoLogger(JobLogController.name)
    private readonly logger: PinoLogger

    /** 定时任务日志服务 */
    @Inject(JobLogService)
    private readonly jobLogService: JobLogService

    /**
     * 获取定时任务日志列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysJobLog[]>} 日志列表
     */
    @Permission("system:jobLog:read")
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysJobLog[]> {

        this.logger.info("[getList] started")
        const data = await this.jobLogService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页定时任务日志列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysJobLog>>} 日志列表和总数
     */
    @Permission("system:jobLog:read")
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysJobLog>> {

        this.logger.info("[getPageList] started")
        const data = await this.jobLogService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 批量删除定时任务日志
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:jobLog:delete")
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.jobLogService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

    /**
     * 删除所有定时任务日志
     *
     * @returns {Promise<void>}
     */
    @Permission("system:jobLog:delete")
    @Post("deleteAll")
    public async deleteAll (): Promise<void> {

        this.logger.info("[deleteAll] started")
        await this.jobLogService.deleteAll()
        this.logger.info("[deleteAll] completed")

    }

}
