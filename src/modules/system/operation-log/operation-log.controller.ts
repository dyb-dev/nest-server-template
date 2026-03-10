/*
 * @FileDesc: 操作日志控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"

import { BatchDeleteRequestDto, GetListRequestDto, GetPageListRequestDto } from "./operation-log.dto"
import { OperationLogService } from "./operation-log.service"

import type { SysOperationLog } from "@/prisma/client"
import type { PinoLogger } from "nestjs-pino"

/** 操作日志控制器 */
@Controller("operation-log")
export class OperationLogController {

    /** 日志记录器 */
    @InjectPinoLogger(OperationLogController.name)
    private readonly logger: PinoLogger

    /** 操作日志服务 */
    @Inject(OperationLogService)
    private readonly operationLogService: OperationLogService

    /**
     * 获取操作日志列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysOperationLog[]>} 日志列表
     */
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysOperationLog[]> {

        this.logger.info("[getList] started")
        const data = await this.operationLogService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页操作日志列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysOperationLog>>} 日志列表和总数
     */
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysOperationLog>> {

        this.logger.info("[getPageList] started")
        const data = await this.operationLogService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 批量删除操作日志
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.operationLogService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

    /**
     * 删除所有操作日志
     *
     * @returns {Promise<void>}
     */
    @Post("deleteAll")
    public async deleteAll (): Promise<void> {

        this.logger.info("[deleteAll] started")
        await this.operationLogService.deleteAll()
        this.logger.info("[deleteAll] completed")

    }

}
