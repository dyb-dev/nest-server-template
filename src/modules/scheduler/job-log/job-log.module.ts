/*
 * @FileDesc: 定时任务日志模块
 */

import { Module } from "@nestjs/common"

import { JobLogController } from "./job-log.controller"
import { JobLogRepository } from "./job-log.repository"
import { JobLogService } from "./job-log.service"

/** 定时任务日志模块 */
@Module({
    controllers: [JobLogController],
    providers: [JobLogRepository, JobLogService],
    exports: [JobLogService]
})
export class JobLogModule {}
