/*
 * @FileDesc: 用户角色服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { UserRoleRepository } from "./user-role.repository"

import type { PinoLogger } from "nestjs-pino"

/** 用户角色服务 */
@Injectable()
export class UserRoleService {

    /** 日志记录器 */
    @InjectPinoLogger(UserRoleService.name)
    private readonly logger: PinoLogger

    /** 用户角色仓储 */
    @Inject(UserRoleRepository)
    private readonly userRoleRepository: UserRoleRepository

    /**
     * 设置用户角色关联
     *
     * @param {number} userId 用户ID
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async setRolesByUserId (userId: number, roleIds: number[]): Promise<void> {

        this.logger.info("[setRolesByUserId] started")
        await this.userRoleRepository.deleteMany({ where: { userId } })
        if (roleIds.length > 0) {

            await this.userRoleRepository.createMany(roleIds.map(roleId => ({ userId, roleId })))

        }
        this.logger.info("[setRolesByUserId] completed")

    }

    /**
     * 根据角色ID数组删除所有用户关联
     *
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async deleteByRoleIds (roleIds: number[]): Promise<void> {

        this.logger.info("[deleteByRoleIds] started")
        await this.userRoleRepository.deleteMany({ where: { roleId: { in: roleIds } } })
        this.logger.info("[deleteByRoleIds] completed")

    }

    /**
     * 根据用户ID数组删除所有角色关联
     *
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async deleteByUserIds (userIds: number[]): Promise<void> {

        this.logger.info("[deleteByUserIds] started")
        await this.userRoleRepository.deleteMany({ where: { userId: { in: userIds } } })
        this.logger.info("[deleteByUserIds] completed")

    }

}
