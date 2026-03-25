/*
 * @FileDesc: 菜单模块
 */

import { Module } from "@nestjs/common"

import { RoleMenuModule } from "../role-menu"
import { UserRoleModule } from "../user-role"

import { MenuController } from "./menu.controller"
import { MenuRepository } from "./menu.repository"
import { MenuService } from "./menu.service"

/** 菜单模块 */
@Module({
    imports: [RoleMenuModule, UserRoleModule],
    controllers: [MenuController],
    providers: [MenuRepository, MenuService],
    exports: [MenuService]
})
export class MenuModule {}
