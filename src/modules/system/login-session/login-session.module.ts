/*
 * @FileDesc: 登录会话模块
 */

import { Module } from "@nestjs/common"

import { CryptoModule } from "../../shared"

import { LoginSessionController } from "./login-session.controller"
import { LoginSessionRepository } from "./login-session.repository"
import { LoginSessionService } from "./login-session.service"

/** 登录会话模块 */
@Module({
    imports: [CryptoModule],
    controllers: [LoginSessionController],
    providers: [LoginSessionRepository, LoginSessionService],
    exports: [LoginSessionService]
})
export class LoginSessionModule {}
