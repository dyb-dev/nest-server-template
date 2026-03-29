/*
 * @FileDesc: 登录日志控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"

import { BatchDeleteRequestDto, GetListRequestDto, GetPageListRequestDto } from "./login-log.dto"
import { LoginLogService } from "./login-log.service"

import type { SysLoginLog } from "@/prisma/client"
import type { PinoLogger } from "nestjs-pino"

/** 登录日志控制器 */
@Controller("login-log")
export class LoginLogController {

    /** 日志记录器 */
    @InjectPinoLogger(LoginLogController.name)
    private readonly logger: PinoLogger

    /** 登录日志服务 */
    @Inject(LoginLogService)
    private readonly loginLogService: LoginLogService

    /**
     * 获取登录日志列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysLoginLog[]>} 日志列表
     */
    @Permission("system:loginLog:read")
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysLoginLog[]> {

        this.logger.info("[getList] started")
        const data = await this.loginLogService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页登录日志列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysLoginLog>>} 日志列表和总数
     */
    @Permission("system:loginLog:read")
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysLoginLog>> {

        this.logger.info("[getPageList] started")
        const data = await this.loginLogService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 批量删除登录日志
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:loginLog:delete")
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.loginLogService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

    /**
     * 删除所有登录日志
     *
     * @returns {Promise<void>}
     */
    @Permission("system:loginLog:delete")
    @Post("deleteAll")
    public async deleteAll (): Promise<void> {

        this.logger.info("[deleteAll] started")
        await this.loginLogService.deleteAll()
        this.logger.info("[deleteAll] completed")

    }

}
