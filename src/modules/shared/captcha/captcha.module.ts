/*
 * @FileDesc: 验证码模块
 */

import { Module } from "@nestjs/common"

import { CaptchaController } from "./captcha.controller"
import { CaptchaService } from "./captcha.service"

/** 验证码模块 */
@Module({
    controllers: [CaptchaController],
    providers: [CaptchaService],
    exports: [CaptchaService]
})
export class CaptchaModule {}
