/*
 * @FileDesc: 角色部门服务
 */

import { Inject, Injectable } from "@nestjs/common"

import { RoleDeptRepository } from "./role-dept.repository"

/** 角色部门服务 */
@Injectable()
export class RoleDeptService {

    /** 角色部门仓储 */
    @Inject(RoleDeptRepository)
    private readonly roleDeptRepository: RoleDeptRepository

    /**
     * 根据角色ID数组查询所有绑定的部门ID数组
     *
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<number[]>} 部门ID数组
     */
    public async findDeptIdsByRoleIds (roleIds: number[]): Promise<number[]> {

        const list = await this.roleDeptRepository.findMany({ where: { roleId: { in: roleIds } } })
        return list.map(item => item.deptId)

    }

    /**
     * 设置角色部门关联
     *
     * @param {number} roleId 角色ID
     * @param {number[]} deptIds 部门ID数组
     * @returns {Promise<void>}
     */
    public async setDeptsByRoleId (roleId: number, deptIds: number[]): Promise<void> {

        await this.roleDeptRepository.deleteMany({ where: { roleId } })
        if (deptIds.length > 0) {

            await this.roleDeptRepository.createMany(deptIds.map(deptId => ({ roleId, deptId })))

        }

    }

    /**
     * 根据角色ID数组删除所有部门关联
     *
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async deleteByRoleIds (roleIds: number[]): Promise<void> {

        await this.roleDeptRepository.deleteMany({ where: { roleId: { in: roleIds } } })

    }

    /**
     * 根据部门ID校验是否存在角色绑定
     *
     * @param {number} deptId 部门ID
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsByDeptId (deptId: number): Promise<boolean> {

        const exists = await this.roleDeptRepository.exists({ deptId })
        return exists

    }

}
