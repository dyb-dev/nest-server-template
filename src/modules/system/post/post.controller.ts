/*
 * @FileDesc: 岗位控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission, User } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"

import {
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    CreateRequestDto,
    UpdateRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./post.dto"
import { PostService } from "./post.service"

import type { SysPost } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 岗位控制器 */
@Controller("post")
export class PostController {

    /** 日志记录器 */
    @InjectPinoLogger(PostController.name)
    private readonly logger: PinoLogger

    /** 岗位服务 */
    @Inject(PostService)
    private readonly postService: PostService

    /**
     * 获取岗位列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysPost[]>} 岗位列表
     */
    @Permission("system:post:read")
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysPost[]> {

        this.logger.info("[getList] started")
        const data = await this.postService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页岗位列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysPost>>} 岗位列表和总数
     */
    @Permission("system:post:read")
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysPost>> {

        this.logger.info("[getPageList] started")
        const data = await this.postService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取岗位详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<SysPost>} 岗位详情
     */
    @Permission("system:post:read")
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<SysPost> {

        this.logger.info("[getDetail] started")
        const data = await this.postService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建岗位
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:post:create")
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.postService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新岗位
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:post:update")
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.postService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 删除岗位
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:post:delete")
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.postService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除岗位
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:post:delete")
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.postService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

}
