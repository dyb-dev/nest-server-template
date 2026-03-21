/*
 * @FileDesc: 角色部门模块
 */

import { Module } from "@nestjs/common"

import { RoleDeptRepository } from "./role-dept.repository"
import { RoleDeptService } from "./role-dept.service"

/** 角色部门模块 */
@Module({
    providers: [RoleDeptRepository, RoleDeptService],
    exports: [RoleDeptService]
})
export class RoleDeptModule {}
