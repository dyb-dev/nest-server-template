/*
 * @FileDesc: 认证模块
 */

import { forwardRef, Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"

import { LoginLogModule, LoginSessionModule } from "../monitor"
import { CaptchaModule, CsrfModule } from "../shared"
import { ConfigModule, UserModule } from "../system"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

/** 认证模块 */
@Module({
    imports: [
        JwtModule,
        CaptchaModule,
        forwardRef(() => CsrfModule),
        LoginLogModule,
        forwardRef(() => LoginSessionModule),
        UserModule,
        ConfigModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
