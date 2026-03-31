/*
 * @FileDesc: 调度模块
 */

import { Module } from "@nestjs/common"

import { JobModule } from "./job"
import { JobLogModule } from "./job-log"

/** 调度模块 */
@Module({
    imports: [JobModule, JobLogModule],
    exports: [JobModule, JobLogModule]
})
export class SchedulerModule {}
