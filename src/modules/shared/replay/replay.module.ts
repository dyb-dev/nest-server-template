/*
 * @FileDesc: 防重放模块
 */

import { Module } from "@nestjs/common"

import { ReplayService } from "./replay.service"

/** 防重放模块 */
@Module({
    providers: [ReplayService],
    exports: [ReplayService]
})
export class ReplayModule {}
