/*
 * @FileDesc: 角色模块
 */

import { forwardRef, Module } from "@nestjs/common"

import { DeptModule } from "../dept"
import { MenuModule } from "../menu"
import { RoleDeptModule } from "../role-dept"
import { RoleMenuModule } from "../role-menu"
import { UserModule } from "../user"
import { UserRoleModule } from "../user-role"

import { RoleController } from "./role.controller"
import { RoleRepository } from "./role.repository"
import { RoleService } from "./role.service"

/** 角色模块 */
@Module({
    imports: [
        forwardRef(() => DeptModule),
        RoleDeptModule,
        UserRoleModule,
        forwardRef(() => UserModule),
        MenuModule,
        RoleMenuModule
    ],
    controllers: [RoleController],
    providers: [RoleRepository, RoleService],
    exports: [RoleService]
})
export class RoleModule {}
