/*
 * @FileDesc: 参数配置模块
 */

import { Module } from "@nestjs/common"

import { ConfigController } from "./config.controller"
import { ConfigRepository } from "./config.repository"
import { ConfigService } from "./config.service"

/** 参数配置模块 */
@Module({
    controllers: [ConfigController],
    providers: [ConfigRepository, ConfigService],
    exports: [ConfigService]
})
export class ConfigModule {}
