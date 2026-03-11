/*
 * @FileDesc: 系统模块
 */

import { Module } from "@nestjs/common"

import { ConfigModule } from "./config"
import { DictItemModule } from "./dict-item"
import { DictTypeModule } from "./dict-type"
import { LoginLogModule } from "./login-log"
import { LoginSessionModule } from "./login-session"
import { OperationLogModule } from "./operation-log"
import { UserModule } from "./user"

/** 系统模块 */
@Module({
    imports: [LoginLogModule, LoginSessionModule, OperationLogModule, UserModule, ConfigModule, DictTypeModule, DictItemModule],
    exports: [LoginLogModule, LoginSessionModule, OperationLogModule, UserModule, ConfigModule, DictTypeModule, DictItemModule]
})
export class SystemModule {}
