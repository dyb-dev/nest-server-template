/*
 * @FileDesc: 角色菜单模块
 */

import { Module } from "@nestjs/common"

import { RoleMenuRepository } from "./role-menu.repository"
import { RoleMenuService } from "./role-menu.service"

/** 角色菜单模块 */
@Module({
    providers: [RoleMenuRepository, RoleMenuService],
    exports: [RoleMenuService]
})
export class RoleMenuModule {}
