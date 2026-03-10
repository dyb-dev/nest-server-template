/*
 * @FileDesc: 认证模块
 */

import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"

import { CaptchaModule, CsrfModule } from "../shared"
import { LoginLogModule, LoginSessionModule, UserModule } from "../system"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

/** 认证模块 */
@Module({
    imports: [JwtModule, CaptchaModule, CsrfModule, LoginLogModule, LoginSessionModule, UserModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
