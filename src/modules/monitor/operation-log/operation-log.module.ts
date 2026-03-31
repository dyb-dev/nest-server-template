/*
 * @FileDesc: 操作日志模块
 */

import { Module } from "@nestjs/common"

import { OperationLogController } from "./operation-log.controller"
import { OperationLogRepository } from "./operation-log.repository"
import { OperationLogService } from "./operation-log.service"

/** 操作日志模块 */
@Module({
    controllers: [OperationLogController],
    providers: [OperationLogRepository, OperationLogService],
    exports: [OperationLogService]
})
export class OperationLogModule {}
