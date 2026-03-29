/*
 * @FileDesc: 权限模块
 */

import { Module } from "@nestjs/common"

import { MenuModule } from "../../system"

import { PermissionService } from "./permission.service"

/** 权限模块 */
@Module({
    imports: [MenuModule],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {}
