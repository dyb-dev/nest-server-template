/*
 * @FileDesc: 位置模块
 */

import { Module } from "@nestjs/common"

import { LocationService } from "./location.service"

/** 位置模块 */
@Module({
    providers: [LocationService],
    exports: [LocationService]
})
export class LocationModule {}
