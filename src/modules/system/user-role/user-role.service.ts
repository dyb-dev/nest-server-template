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
     * 根据用户ID查询该用户所有角色ID数组
     *
     * @param {number} userId 用户ID
     * @returns {Promise<number[]>} 角色ID数组
     */
    public async findRoleIdsByUserId (userId: number): Promise<number[]> {

        this.logger.info("[findRoleIdsByUserId] started")
        const list = await this.userRoleRepository.findMany({ where: { userId } })
        this.logger.info("[findRoleIdsByUserId] completed")
        return list.map(item => item.roleId)

    }

    /**
     * 根据角色ID查询已创建的用户ID数组（可指定范围过滤）
     *
     * @param {number} roleId 角色ID
     * @param {number[]} [userIds] 过滤的用户ID范围
     * @returns {Promise<number[]>} 用户ID数组
     */
    public async findUserIdsByRoleId (roleId: number, userIds?: number[]): Promise<number[]> {

        this.logger.info("[findUserIdsByRoleId] started")
        const list = await this.userRoleRepository.findMany({
            where: {
                roleId,
                ...userIds && { userId: { in: userIds } }
            }
        })
        this.logger.info("[findUserIdsByRoleId] completed")
        return list.map(item => item.userId)

    }

    /**
     * 批量创建用户到角色
     *
     * @param {number} roleId 角色ID
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async createUsersByRoleId (roleId: number, userIds: number[]): Promise<void> {

        this.logger.info("[createUsersByRoleId] started")
        await this.userRoleRepository.createMany(userIds.map(userId => ({ roleId, userId })))
        this.logger.info("[createUsersByRoleId] completed")

    }

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

    /**
     * 批量删除角色下的用户
     *
     * @param {number} roleId 角色ID
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async deleteUsersByRoleId (roleId: number, userIds: number[]): Promise<void> {

        this.logger.info("[deleteUsersByRoleId] started")
        await this.userRoleRepository.deleteMany({ where: { roleId, userId: { in: userIds } } })
        this.logger.info("[deleteUsersByRoleId] completed")

    }

    /**
     * 校验单个用户与角色的绑定关系是否存在
     *
     * @param {number} roleId 角色ID
     * @param {number} userId 用户ID
     * @returns {Promise<boolean>} 是否存在绑定关系
     */
    public async existsByRoleIdAndUserId (roleId: number, userId: number): Promise<boolean> {

        this.logger.info("[existsByRoleIdAndUserId] started")
        const exists = await this.userRoleRepository.exists({ roleId, userId })
        this.logger.info("[existsByRoleIdAndUserId] completed")
        return exists

    }

}
