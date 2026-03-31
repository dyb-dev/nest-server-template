/*
 * @FileDesc: 缓存监控模块
 */

import { Module } from "@nestjs/common"

import { CacheController } from "./cache.controller"
import { CacheService } from "./cache.service"

/** 缓存监控模块 */
@Module({
    controllers: [CacheController],
    providers: [CacheService],
    exports: [CacheService]
})
export class CacheModule {}
