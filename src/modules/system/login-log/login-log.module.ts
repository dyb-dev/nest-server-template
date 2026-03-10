/*
 * @FileDesc: 登录日志模块
 */

import { Module } from "@nestjs/common"

import { LoginLogController } from "./login-log.controller"
import { LoginLogRepository } from "./login-log.repository"
import { LoginLogService } from "./login-log.service"

/** 登录日志模块 */
@Module({
    controllers: [LoginLogController],
    providers: [LoginLogRepository, LoginLogService],
    exports: [LoginLogService]
})
export class LoginLogModule {}
