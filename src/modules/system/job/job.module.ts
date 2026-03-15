/*
 * @FileDesc: 定时任务模块
 */

import { Module } from "@nestjs/common"
import { DiscoveryModule } from "@nestjs/core"

import { JobLogModule } from "../job-log"

import { JobController } from "./job.controller"
import { JobRepository } from "./job.repository"
import { JobScheduler } from "./job.scheduler"
import { JobService } from "./job.service"

/** 定时任务模块 */
@Module({
    imports: [DiscoveryModule, JobLogModule],
    controllers: [JobController],
    providers: [JobRepository, JobScheduler, JobService],
    exports: [JobService]
})
export class JobModule {}
