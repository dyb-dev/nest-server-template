/*
 * @FileDesc: 角色菜单服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { RoleMenuRepository } from "./role-menu.repository"

import type { PinoLogger } from "nestjs-pino"

/** 角色菜单服务 */
@Injectable()
export class RoleMenuService {

    /** 日志记录器 */
    @InjectPinoLogger(RoleMenuService.name)
    private readonly logger: PinoLogger

    /** 角色菜单仓储 */
    @Inject(RoleMenuRepository)
    private readonly roleMenuRepository: RoleMenuRepository

    /**
     * 设置角色菜单关联
     *
     * @param {number} roleId 角色ID
     * @param {number[]} menuIds 菜单ID数组
     * @returns {Promise<void>}
     */
    public async setMenusByRoleId (roleId: number, menuIds: number[]): Promise<void> {

        this.logger.info("[setMenusByRoleId] started")
        await this.roleMenuRepository.deleteMany({ where: { roleId } })
        if (menuIds.length > 0) {

            await this.roleMenuRepository.createMany(menuIds.map(menuId => ({ roleId, menuId })))

        }
        this.logger.info("[setMenusByRoleId] completed")

    }

    /**
     * 根据角色ID数组删除所有菜单关联
     *
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async deleteByRoleIds (roleIds: number[]): Promise<void> {

        this.logger.info("[deleteByRoleIds] started")
        await this.roleMenuRepository.deleteMany({ where: { roleId: { in: roleIds } } })
        this.logger.info("[deleteByRoleIds] completed")

    }

    /**
     * 根据菜单ID删除所有角色关联
     *
     * @param {number} menuId 菜单ID
     * @returns {Promise<void>}
     */
    public async deleteByMenuId (menuId: number): Promise<void> {

        this.logger.info("[deleteByMenuId] started")
        await this.roleMenuRepository.deleteMany({ where: { menuId } })
        this.logger.info("[deleteByMenuId] completed")

    }

}
