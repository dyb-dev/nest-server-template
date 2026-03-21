/*
 * @FileDesc: 用户角色模块
 */

import { Module } from "@nestjs/common"

import { UserRoleRepository } from "./user-role.repository"
import { UserRoleService } from "./user-role.service"

/** 用户角色模块 */
@Module({
    providers: [UserRoleRepository, UserRoleService],
    exports: [UserRoleService]
})
export class UserRoleModule {}
