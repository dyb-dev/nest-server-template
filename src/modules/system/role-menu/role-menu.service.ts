/*
 * @FileDesc: 角色菜单服务
 */

import { Inject, Injectable } from "@nestjs/common"

import { RoleMenuRepository } from "./role-menu.repository"

/** 角色菜单服务 */
@Injectable()
export class RoleMenuService {

    /** 角色菜单仓储 */
    @Inject(RoleMenuRepository)
    private readonly roleMenuRepository: RoleMenuRepository

    /**
     * 根据角色ID数组查询所有菜单ID数组
     *
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<number[]>} 菜单ID数组
     */
    public async findMenuIdsByRoleIds (roleIds: number[]): Promise<number[]> {

        const list = await this.roleMenuRepository.findMany({ where: { roleId: { in: roleIds } } })
        return list.map(item => item.menuId)

    }

    /**
     * 根据菜单ID查询所有角色ID数组
     *
     * @param {number} menuId 菜单ID
     * @returns {Promise<number[]>} 角色ID数组
     */
    public async findRoleIdsByMenuId (menuId: number): Promise<number[]> {

        const list = await this.roleMenuRepository.findMany({ where: { menuId } })
        return list.map(item => item.roleId)

    }

    /**
     * 设置角色菜单关联
     *
     * @param {number} roleId 角色ID
     * @param {number[]} menuIds 菜单ID数组
     * @returns {Promise<void>}
     */
    public async setMenusByRoleId (roleId: number, menuIds: number[]): Promise<void> {

        await this.roleMenuRepository.deleteMany({ where: { roleId } })
        if (menuIds.length > 0) {

            await this.roleMenuRepository.createMany(menuIds.map(menuId => ({ roleId, menuId })))

        }

    }

    /**
     * 设置菜单角色关联
     *
     * @param {number} menuId 菜单ID
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async setRolesByMenuId (menuId: number, roleIds: number[]): Promise<void> {

        await this.roleMenuRepository.deleteMany({ where: { menuId } })
        if (roleIds.length > 0) {

            await this.roleMenuRepository.createMany(roleIds.map(roleId => ({ roleId, menuId })))

        }

    }

    /**
     * 根据角色ID数组删除所有菜单关联
     *
     * @param {number[]} roleIds 角色ID数组
     * @returns {Promise<void>}
     */
    public async deleteByRoleIds (roleIds: number[]): Promise<void> {

        await this.roleMenuRepository.deleteMany({ where: { roleId: { in: roleIds } } })

    }

    /**
     * 根据菜单ID删除所有角色关联
     *
     * @param {number} menuId 菜单ID
     * @returns {Promise<void>}
     */
    public async deleteByMenuId (menuId: number): Promise<void> {

        await this.roleMenuRepository.deleteMany({ where: { menuId } })

    }

}
