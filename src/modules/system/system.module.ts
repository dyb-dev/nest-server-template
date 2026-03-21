/*
 * @FileDesc: 系统模块
 */

import { Module } from "@nestjs/common"

import { ConfigModule } from "./config"
import { DeptModule } from "./dept"
import { DictItemModule } from "./dict-item"
import { DictTypeModule } from "./dict-type"
import { JobModule } from "./job"
import { JobLogModule } from "./job-log"
import { LoginLogModule } from "./login-log"
import { LoginSessionModule } from "./login-session"
import { NoticeModule } from "./notice"
import { OperationLogModule } from "./operation-log"
import { PostModule } from "./post"
import { RoleModule } from "./role"
import { RoleDeptModule } from "./role-dept"
import { UserModule } from "./user"
import { UserPostModule } from "./user-post"
import { UserRoleModule } from "./user-role"

/** 系统模块 */
@Module({
    imports: [
        LoginLogModule,
        LoginSessionModule,
        OperationLogModule,
        UserModule,
        ConfigModule,
        DictTypeModule,
        DictItemModule,
        JobModule,
        JobLogModule,
        NoticeModule,
        DeptModule,
        PostModule,
        UserPostModule,
        RoleModule,
        RoleDeptModule,
        UserRoleModule
    ],
    exports: [
        LoginLogModule,
        LoginSessionModule,
        OperationLogModule,
        UserModule,
        ConfigModule,
        DictTypeModule,
        DictItemModule,
        JobModule,
        JobLogModule,
        NoticeModule,
        DeptModule,
        PostModule,
        UserPostModule,
        RoleModule,
        RoleDeptModule,
        UserRoleModule
    ]
})
export class SystemModule {}
