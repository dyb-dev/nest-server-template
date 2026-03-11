/*
 * @FileDesc: 字典项控制器
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
} from "./dict-item.dto"
import { DictItemService } from "./dict-item.service"

import type { SysDictItem } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 字典项控制器 */
@Controller("dict-item")
export class DictItemController {

    /** 日志记录器 */
    @InjectPinoLogger(DictItemController.name)
    private readonly logger: PinoLogger

    /** 字典项服务 */
    @Inject(DictItemService)
    private readonly dictItemService: DictItemService

    /**
     * 获取字典项列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysDictItem[]>} 字典项列表
     */
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysDictItem[]> {

        this.logger.info("[getList] started")
        const data = await this.dictItemService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页字典项列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysDictItem>>} 字典项列表和总数
     */
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysDictItem>> {

        this.logger.info("[getPageList] started")
        const data = await this.dictItemService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取字典项详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<SysDictItem>} 字典项详情
     */
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<SysDictItem> {

        this.logger.info("[getDetail] started")
        const data = await this.dictItemService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建字典项
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.dictItemService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新字典项
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.dictItemService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 删除字典项
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.dictItemService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除字典项
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.dictItemService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

}
