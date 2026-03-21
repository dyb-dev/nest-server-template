/*
 * @FileDesc: 角色部门服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { RoleDeptRepository } from "./role-dept.repository"

import type { PinoLogger } from "nestjs-pino"

/** 角色部门服务 */
@Injectable()
export class RoleDeptService {

    /** 日志记录器 */
    @InjectPinoLogger(RoleDeptService.name)
    private readonly logger: PinoLogger

    /** 角色部门仓储 */
    @Inject(RoleDeptRepository)
    private readonly roleDeptRepository: RoleDeptRepository

    /**
     * 设置角色部门关联
     *
     * @param {number} roleId 角色ID
     * @param {number[]} deptIds 部门ID数组
     * @returns {Promise<void>}
     */
    public async setDeptsByRoleId (roleId: number, deptIds: number[]): Promise<void> {

        this.logger.info("[setDeptsByRoleId] started")
        await this.roleDeptRepository.deleteMany({ where: { roleId } })
        if (deptIds.length > 0) {

            await this.roleDeptRepository.createMany(deptIds.map(deptId => ({ roleId, deptId })))

        }
        this.logger.info("[setDeptsByRoleId] completed")

    }

    /**
     * 根据部门ID校验是否存在角色绑定
     *
     * @param {number} deptId 部门ID
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsByDeptId (deptId: number): Promise<boolean> {

        this.logger.info("[existsByDeptId] started")
        const exists = await this.roleDeptRepository.exists({ deptId })
        this.logger.info("[existsByDeptId] completed")
        return exists

    }

    /**
     * 根据角色ID数组删除所有部门关联
     *
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async deleteByRoleIds (roleIds: number[]): Promise<void> {

        this.logger.info("[deleteByRoleIds] started")
        await this.roleDeptRepository.deleteMany({ where: { roleId: { in: roleIds } } })
        this.logger.info("[deleteByRoleIds] completed")

    }

}
