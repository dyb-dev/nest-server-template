/*
 * @FileDesc: 字典类型控制器
 */

import { Controller, Post, Get, Body, Query, Inject } from "@nestjs/common"
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
} from "./dict-type.dto"
import { DictTypeService } from "./dict-type.service"

import type { SysDictType } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 字典类型控制器 */
@Controller("dict-type")
export class DictTypeController {

    /** 日志记录器 */
    @InjectPinoLogger(DictTypeController.name)
    private readonly logger: PinoLogger

    /** 字典类型服务 */
    @Inject(DictTypeService)
    private readonly dictTypeService: DictTypeService

    /**
     * 获取字典类型列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysDictType[]>} 字典类型列表
     */
    @Permission("system:dictType:read")
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysDictType[]> {

        this.logger.info("[getList] started")
        const data = await this.dictTypeService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页字典类型列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysDictType>>} 字典类型列表和总数
     */
    @Permission("system:dictType:read")
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysDictType>> {

        this.logger.info("[getPageList] started")
        const data = await this.dictTypeService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取字典类型详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<SysDictType>} 字典类型详情
     */
    @Permission("system:dictType:read")
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<SysDictType> {

        this.logger.info("[getDetail] started")
        const data = await this.dictTypeService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建字典类型
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:dictType:create")
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.dictTypeService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新字典类型
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:dictType:update")
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.dictTypeService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 删除字典类型
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:dictType:delete")
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.dictTypeService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除字典类型
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:dictType:delete")
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.dictTypeService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

}
