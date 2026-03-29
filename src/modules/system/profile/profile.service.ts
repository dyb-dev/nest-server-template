/*
 * @FileDesc: 个人主页服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"
import { UserService } from "../user"

import { UpdatePasswordRequestDto, UpdateAvatarRequestDto, UpdateInfoRequestDto } from "./profile.dto"

import type { SysUser } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 个人主页服务 */
@Injectable()
export class ProfileService {

    /** 日志记录器 */
    @InjectPinoLogger(ProfileService.name)
    private readonly logger: PinoLogger

    /** 用户服务 */
    @Inject(UserService)
    private readonly userService: UserService

    /**
     * 获取个人信息
     *
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">>} 用户详情
     */
    public async getInfo (user: Request["user"]): Promise<Omit<SysUser, "password" | "deletedAt">> {

        this.logger.info("[getInfo] started")
        if (!user) {

            throw new BusinessLogicException("用户未登录")

        }
        const data = await this.userService.findById(user.id)
        this.logger.info("[getInfo] completed")
        return data

    }

    /**
     * 更新个人信息
     *
     * @param {UpdateInfoRequestDto} params 更新个人信息参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updateInfo (params: UpdateInfoRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updateInfo] started")
        await this.userService.updateInfo(params, user)
        this.logger.info("[updateInfo] completed")

    }

    /**
     * 更新密码
     *
     * @param {UpdatePasswordRequestDto} params 更新密码参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updatePassword (params: UpdatePasswordRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updatePassword] started")
        await this.userService.updatePassword(params, user)
        this.logger.info("[updatePassword] completed")

    }

    /**
     * 更新头像
     *
     * @param {UpdateAvatarRequestDto} params 更新头像参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updateAvatar (params: UpdateAvatarRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updateAvatar] started")
        await this.userService.updateAvatar(params, user)
        this.logger.info("[updateAvatar] completed")

    }

}
