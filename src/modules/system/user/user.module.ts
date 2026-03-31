/*
 * @FileDesc: 用户模块
 */

import { forwardRef, Module } from "@nestjs/common"

import { LoginSessionModule } from "../../monitor"
import { DeptModule } from "../dept"
import { PostModule } from "../post"
import { RoleModule } from "../role"
import { RoleDeptModule } from "../role-dept"
import { UserPostModule } from "../user-post"
import { UserRoleModule } from "../user-role"

import { UserController } from "./user.controller"
import { UserRepository } from "./user.repository"
import { UserService } from "./user.service"

/** 用户模块 */
@Module({
    imports: [
        forwardRef(() => LoginSessionModule),
        forwardRef(() => DeptModule),
        PostModule,
        UserPostModule,
        forwardRef(() => RoleModule),
        UserRoleModule,
        RoleDeptModule
    ],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserService]
})
export class UserModule {}
