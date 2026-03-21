/*
 * @FileDesc: 角色控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { User } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"

import {
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    CreateRequestDto,
    UpdateRequestDto,
    UpdateStatusRequestDto,
    UpdateDataScopeRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./role.dto"
import { RoleService } from "./role.service"

import type { SysRole } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 角色控制器 */
@Controller("role")
export class RoleController {

    /** 日志记录器 */
    @InjectPinoLogger(RoleController.name)
    private readonly logger: PinoLogger

    /** 角色服务 */
    @Inject(RoleService)
    private readonly roleService: RoleService

    /**
     * 获取角色列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<Omit<SysRole, "deletedAt">[]>} 角色列表
     */
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<Omit<SysRole, "deletedAt">[]> {

        this.logger.info("[getList] started")
        const data = await this.roleService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页角色列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<Omit<SysRole, "deletedAt">>>} 角色列表和总数
     */
    @Get("getPageList")
    public async getPageList (@Query() query: GetPageListRequestDto): Promise<PaginationResponseDto<Omit<SysRole, "deletedAt">>> {

        this.logger.info("[getPageList] started")
        const data = await this.roleService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取角色详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<Omit<SysRole, "deletedAt">>} 角色详情
     */
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<Omit<SysRole, "deletedAt">> {

        this.logger.info("[getDetail] started")
        const data = await this.roleService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建角色
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.roleService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新角色
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.roleService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 更新角色状态
     *
     * @param {UpdateStatusRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("updateStatus")
    public async updateStatus (@Body() body: UpdateStatusRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[updateStatus] started")
        await this.roleService.updateStatus(body, user)
        this.logger.info("[updateStatus] completed")

    }

    /**
     * 更新角色数据权限
     *
     * @param {UpdateDataScopeRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("updateDataScope")
    public async updateDataScope (@Body() body: UpdateDataScopeRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[updateDataScope] started")
        await this.roleService.updateDataScope(body, user)
        this.logger.info("[updateDataScope] completed")

    }

    /**
     * 删除角色
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.roleService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除角色
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.roleService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

}
