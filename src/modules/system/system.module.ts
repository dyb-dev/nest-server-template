/*
 * @FileDesc: 系统模块
 */

import { Module } from "@nestjs/common"

import { ConfigModule } from "./config"
import { DeptModule } from "./dept"
import { DictItemModule } from "./dict-item"
import { DictTypeModule } from "./dict-type"
import { MenuModule } from "./menu"
import { NoticeModule } from "./notice"
import { PostModule } from "./post"
import { ProfileModule } from "./profile"
import { RoleModule } from "./role"
import { RoleDeptModule } from "./role-dept"
import { RoleMenuModule } from "./role-menu"
import { UserModule } from "./user"
import { UserPostModule } from "./user-post"
import { UserRoleModule } from "./user-role"

/** 系统模块 */
@Module({
    imports: [
        ConfigModule,
        DeptModule,
        DictItemModule,
        DictTypeModule,
        MenuModule,
        NoticeModule,
        PostModule,
        ProfileModule,
        RoleModule,
        RoleDeptModule,
        RoleMenuModule,
        UserModule,
        UserPostModule,
        UserRoleModule
    ],
    exports: [
        ConfigModule,
        DeptModule,
        DictItemModule,
        DictTypeModule,
        MenuModule,
        NoticeModule,
        PostModule,
        ProfileModule,
        RoleModule,
        RoleDeptModule,
        RoleMenuModule,
        UserModule,
        UserPostModule,
        UserRoleModule
    ]
})
export class SystemModule {}
