/*
 * @FileDesc: 部门模块
 */

import { forwardRef, Module } from "@nestjs/common"

import { RoleDeptModule } from "../role-dept"
import { UserModule } from "../user"

import { DeptController } from "./dept.controller"
import { DeptRepository } from "./dept.repository"
import { DeptService } from "./dept.service"

/** 部门模块 */
@Module({
    imports: [forwardRef(() => UserModule), RoleDeptModule],
    controllers: [DeptController],
    providers: [DeptRepository, DeptService],
    exports: [DeptService]
})
export class DeptModule {}
