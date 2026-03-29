/*
 * @FileDesc: 个人主页控制器
 */

import { Controller, Get, Post, Body, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { User } from "@/decorators"

import { UpdatePasswordRequestDto, UpdateAvatarRequestDto } from "./profile.dto"
import { ProfileService } from "./profile.service"

import type { SysUser } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 个人主页控制器 */
@Controller("profile")
export class ProfileController {

    /** 日志记录器 */
    @InjectPinoLogger(ProfileController.name)
    private readonly logger: PinoLogger

    /** 个人主页服务 */
    @Inject(ProfileService)
    private readonly profileService: ProfileService

    /**
     * 获取个人信息
     *
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">>} 用户详情
     */
    @Get("getInfo")
    public async getInfo (@User() user: Request["user"]): Promise<Omit<SysUser, "password" | "deletedAt">> {

        this.logger.info("[getInfo] started")
        const data = await this.profileService.getInfo(user)
        this.logger.info("[getInfo] completed")
        return data

    }

    /**
     * 更新密码
     *
     * @param {UpdatePasswordRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("updatePassword")
    public async updatePassword (@Body() body: UpdatePasswordRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[updatePassword] started")
        await this.profileService.updatePassword(body, user)
        this.logger.info("[updatePassword] completed")

    }

    /**
     * 更新头像
     *
     * @param {UpdateAvatarRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("updateAvatar")
    public async updateAvatar (@Body() body: UpdateAvatarRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[updateAvatar] started")
        await this.profileService.updateAvatar(body, user)
        this.logger.info("[updateAvatar] completed")

    }

}
