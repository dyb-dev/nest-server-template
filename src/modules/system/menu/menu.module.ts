/*
 * @FileDesc: 菜单模块
 */

import { forwardRef, Module } from "@nestjs/common"

import { RoleModule } from "../role"
import { RoleMenuModule } from "../role-menu"
import { UserRoleModule } from "../user-role"

import { MenuController } from "./menu.controller"
import { MenuRepository } from "./menu.repository"
import { MenuService } from "./menu.service"

/** 菜单模块 */
@Module({
    imports: [forwardRef(() => RoleModule), RoleMenuModule, UserRoleModule],
    controllers: [MenuController],
    providers: [MenuRepository, MenuService],
    exports: [MenuService]
})
export class MenuModule {}
