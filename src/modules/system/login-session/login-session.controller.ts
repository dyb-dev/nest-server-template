/*
 * @FileDesc: 登录会话控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"

import { DeleteRequestDto, GetListRequestDto, GetPageListRequestDto } from "./login-session.dto"
import { LoginSessionService } from "./login-session.service"

import type { SysLoginSession } from "@/prisma/client"
import type { PinoLogger } from "nestjs-pino"

/** 登录会话控制器 */
@Controller("login-session")
export class LoginSessionController {

    /** 日志记录器 */
    @InjectPinoLogger(LoginSessionController.name)
    private readonly logger: PinoLogger

    /** 登录会话服务 */
    @Inject(LoginSessionService)
    private readonly loginSessionService: LoginSessionService

    /**
     * 获取登录会话列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysLoginSession[]>} 会话列表
     */
    @Permission("system:loginSession:read")
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysLoginSession[]> {

        this.logger.info("[getList] started")
        const data = await this.loginSessionService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页登录会话列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysLoginSession>>} 会话列表和总数
     */
    @Permission("system:loginSession:read")
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysLoginSession>> {

        this.logger.info("[getPageList] started")
        const data = await this.loginSessionService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 删除登录会话
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:loginSession:delete")
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.loginSessionService.delete(body)
        this.logger.info("[delete] completed")

    }

}
