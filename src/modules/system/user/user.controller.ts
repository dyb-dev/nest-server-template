/*
 * @FileDesc: 用户控制器
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
    UpdatePasswordRequestDto,
    UpdateStatusRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto,
    UpdateAvatarRequestDto
} from "./user.dto"
import { UserService } from "./user.service"

import type { SysUser } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 用户控制器 */
@Controller("user")
export class UserController {

    /** 日志记录器 */
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger

    /** 用户服务 */
    @Inject(UserService)
    private readonly userService: UserService

    /**
     * 获取用户列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">[]>} 用户列表
     */
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<Omit<SysUser, "password" | "deletedAt">[]> {

        this.logger.info("[getList] started")
        const data = await this.userService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页用户列表
     *
     * @param {GetPageListRequestDto} query 查询参数
     * @returns {Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>>} 用户列表和总数
     */
    @Get("getPageList")
    public async getPageList (
        @Query() query: GetPageListRequestDto
    ): Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>> {

        this.logger.info("[getPageList] started")
        const data = await this.userService.getPageList(query)
        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取用户详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">>} 用户详情
     */
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<Omit<SysUser, "password" | "deletedAt">> {

        this.logger.info("[getDetail] started")
        const data = await this.userService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建用户
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.userService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新用户
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.userService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 更新用户密码
     *
     * @param {UpdatePasswordRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("updatePassword")
    public async updatePassword (@Body() body: UpdatePasswordRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[updatePassword] started")
        await this.userService.updatePassword(body, user)
        this.logger.info("[updatePassword] completed")

    }

    /**
     * 更新用户状态
     *
     * @param {UpdateStatusRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("updateStatus")
    public async updateStatus (@Body() body: UpdateStatusRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[updateStatus] started")
        await this.userService.updateStatus(body, user)
        this.logger.info("[updateStatus] completed")

    }

    /**
     * 更新用户头像
     *
     * @param {UpdateAvatarRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("updateAvatar")
    public async updateAvatar (@Body() body: UpdateAvatarRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[updateAvatar] started")
        await this.userService.updateAvatar(body, user)
        this.logger.info("[updateAvatar] completed")

    }

    /**
     * 删除用户
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.userService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除用户
     *
     * @param {BatchDeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("batchDelete")
    public async batchDelete (@Body() body: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")
        await this.userService.batchDelete(body)
        this.logger.info("[batchDelete] completed")

    }

}
