/*
 * @FileDesc: 服务器监控模块
 */

import { Module } from "@nestjs/common"

import { ServerController } from "./server.controller"
import { ServerService } from "./server.service"

/** 服务器监控模块 */
@Module({
    controllers: [ServerController],
    providers: [ServerService],
    exports: [ServerService]
})
export class ServerModule {}
