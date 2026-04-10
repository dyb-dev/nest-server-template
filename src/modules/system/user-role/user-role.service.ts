/*
 * @FileDesc: 用户角色服务
 */

import { Inject, Injectable } from "@nestjs/common"

import { UserRoleRepository } from "./user-role.repository"

/** 用户角色服务 */
@Injectable()
export class UserRoleService {

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

        const list = await this.userRoleRepository.findMany({ where: { userId } })
        return list.map(item => item.roleId)

    }

    /**
     * 根据角色ID数组查询已绑定的用户ID数组（可指定范围过滤，已去重）
     *
     * @param {number[]} roleIds 角色ID数组
     * @param {number[]} userIds 过滤的用户ID范围
     * @returns {Promise<number[]>} 用户ID数组
     */
    public async findUserIdsByRoleIds (roleIds: number[], userIds?: number[]): Promise<number[]> {

        const list = await this.userRoleRepository.findMany({
            where: {
                roleId: { in: roleIds },
                ...userIds && { userId: { in: userIds } }
            }
        })
        return [...new Set(list.map(item => item.userId))]

    }

    /**
     * 批量创建用户到角色
     *
     * @param {number} roleId 角色ID
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async createUsersByRoleId (roleId: number, userIds: number[]): Promise<void> {

        await this.userRoleRepository.createMany(userIds.map(userId => ({ roleId, userId })))

    }

    /**
     * 设置用户角色关联
     *
     * @param {number} userId 用户ID
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async setRolesByUserId (userId: number, roleIds: number[]): Promise<void> {

        await this.userRoleRepository.deleteMany({ where: { userId } })
        if (roleIds.length > 0) {

            await this.userRoleRepository.createMany(roleIds.map(roleId => ({ userId, roleId })))

        }

    }

    /**
     * 根据角色ID数组删除所有用户关联
     *
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async deleteByRoleIds (roleIds: number[]): Promise<void> {

        await this.userRoleRepository.deleteMany({ where: { roleId: { in: roleIds } } })

    }

    /**
     * 根据用户ID数组删除所有角色关联
     *
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async deleteByUserIds (userIds: number[]): Promise<void> {

        await this.userRoleRepository.deleteMany({ where: { userId: { in: userIds } } })

    }

    /**
     * 批量删除角色下的用户
     *
     * @param {number} roleId 角色ID
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async deleteUsersByRoleId (roleId: number, userIds: number[]): Promise<void> {

        await this.userRoleRepository.deleteMany({ where: { roleId, userId: { in: userIds } } })

    }

    /**
     * 校验单个用户与角色的绑定关系是否存在
     *
     * @param {number} roleId 角色ID
     * @param {number} userId 用户ID
     * @returns {Promise<boolean>} 是否存在绑定关系
     */
    public async existsByRoleIdAndUserId (roleId: number, userId: number): Promise<boolean> {

        const exists = await this.userRoleRepository.exists({ roleId, userId })
        return exists

    }

}
