/*
 * @FileDesc: 个人主页模块
 */

import { Module } from "@nestjs/common"

import { UserModule } from "../user"

import { ProfileController } from "./profile.controller"
import { ProfileService } from "./profile.service"

/** 个人主页模块 */
@Module({
    imports: [UserModule],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService]
})
export class ProfileModule {}
