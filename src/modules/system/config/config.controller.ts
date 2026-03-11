/*
 * @FileDesc: 参数配置控制器
 */

import { Controller, Post, Get, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { User } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"

import {
    CreateRequestDto,
    UpdateRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./config.dto"
import { ConfigService } from "./config.service"

import type { SysConfig } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 参数配置控制器 */
@Controller("config")
export class ConfigController {

    /** 日志记录器 */
    @InjectPinoLogger(ConfigController.name)
    private readonly logger: PinoLogger

    /** 参数配置服务 */
    @Inject(ConfigService)
    private readonly configService: ConfigService

    /**
     * 获取参数配置列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysConfig[]>} 配置列表
     */
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysConfig[]> {

        this.logger.info("[getList] started")
        const data = await this.configService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页参数配置列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysConfig>>} 配置列表和总数
     */
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysConfig>> {

        this.logger.info("[getPageList] started")
        const data = await this.configService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取参数配置详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<SysConfig>} 配置详情
     */
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<SysConfig> {

        this.logger.info("[getDetail] started")
        const data = await this.configService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建参数配置
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.configService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新参数配置
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.configService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 删除参数配置
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.configService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除参数配置
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.configService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

}
