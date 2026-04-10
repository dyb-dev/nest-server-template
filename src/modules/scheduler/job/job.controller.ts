/*
 * @FileDesc: 定时任务控制器
 */

import { Controller, Post, Get, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission, User } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"

import {
    CreateRequestDto,
    UpdateRequestDto,
    UpdateStatusRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto,
    RunRequestDto
} from "./job.dto"
import { JobService } from "./job.service"

import type { SysJob } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 定时任务控制器 */
@Controller("job")
export class JobController {

    /** 日志记录器 */
    @InjectPinoLogger(JobController.name)
    private readonly logger: PinoLogger

    /** 定时任务服务 */
    @Inject(JobService)
    private readonly jobService: JobService

    /**
     * 获取定时任务列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<SysJob[]>} 定时任务列表
     */
    @Permission("system:job:read")
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysJob[]> {

        this.logger.info("[getList] started")
        const data = await this.jobService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页定时任务列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<SysJob>>} 定时任务列表和总数
     */
    @Permission("system:job:read")
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<SysJob>> {

        this.logger.info("[getPageList] started")
        const data = await this.jobService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取定时任务详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<SysJob>} 定时任务详情
     */
    @Permission("system:job:read")
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<SysJob> {

        this.logger.info("[getDetail] started")
        const data = await this.jobService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 获取可用的调用目标列表
     *
     * @returns {Promise<string[]>} 可用的调用目标列表
     */
    @Permission("system:job:read")
    @Get("getAvailableInvokeTargetList")
    public async getAvailableInvokeTargetList (): Promise<string[]> {

        this.logger.info("[getAvailableInvokeTargetList] started")
        const data = await this.jobService.getAvailableInvokeTargetList()
        this.logger.info("[getAvailableInvokeTargetList] completed")
        return data

    }

    /**
     * 创建定时任务
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:job:create")
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.jobService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新定时任务
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:job:update")
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.jobService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 更新定时任务状态
     *
     * @param {UpdateStatusRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:job:update")
    @Post("updateStatus")
    public async updateStatus (@Body() body: UpdateStatusRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[updateStatus] started")
        await this.jobService.updateStatus(body, user)
        this.logger.info("[updateStatus] completed")

    }

    /**
     * 删除定时任务
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:job:delete")
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.jobService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除定时任务
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:job:delete")
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.jobService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

    /**
     * 执行定时任务
     *
     * @param {RunRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:job:run")
    @Post("run")
    public async run (@Body() body: RunRequestDto): Promise<void> {

        this.logger.info("[run] started")
        await this.jobService.run(body)
        this.logger.info("[run] completed")

    }

}
