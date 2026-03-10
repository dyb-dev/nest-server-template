/*
 * @FileDesc: 用户模块
 */

import { Module } from "@nestjs/common"

import { UserController } from "./user.controller"
import { UserRepository } from "./user.repository"
import { UserService } from "./user.service"

/** 用户模块 */
@Module({
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserService]
})
export class UserModule {}
