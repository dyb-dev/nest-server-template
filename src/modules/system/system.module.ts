/*
 * @FileDesc: 系统模块
 */

import { Module } from "@nestjs/common"

import { LoginLogModule } from "./login-log"
import { LoginSessionModule } from "./login-session"
import { OperationLogModule } from "./operation-log"
import { UserModule } from "./user"

/** 系统模块 */
@Module({
    imports: [LoginLogModule, LoginSessionModule, OperationLogModule, UserModule],
    exports: [LoginLogModule, LoginSessionModule, OperationLogModule, UserModule]
})
export class SystemModule {}
