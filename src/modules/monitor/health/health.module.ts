/*
 * @FileDesc: 健康检查模块
 */

import { Module } from "@nestjs/common"

import { HealthController } from "./health.controller"
import { HealthService } from "./health.service"

/** 健康检查模块 */
@Module({
    controllers: [HealthController],
    providers: [HealthService],
    exports: [HealthService]
})
export class HealthModule {}
