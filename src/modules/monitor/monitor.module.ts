/*
 * @FileDesc: 监控模块
 */

import { Module } from "@nestjs/common"

import { CacheModule } from "./cache"
import { LoginLogModule } from "./login-log"
import { LoginSessionModule } from "./login-session"
import { OperationLogModule } from "./operation-log"
import { ServerModule } from "./server"

/** 监控模块 */
@Module({
    imports: [CacheModule, LoginLogModule, LoginSessionModule, OperationLogModule, ServerModule],
    exports: [CacheModule, LoginLogModule, LoginSessionModule, OperationLogModule, ServerModule]
})
export class MonitorModule {}
