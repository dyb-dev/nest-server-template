/*
 * @FileDesc: 验证码控制器
 */

import { Controller, Get, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Public } from "@/decorators"

import { GetResponseDto } from "./captcha.dto"
import { CaptchaService } from "./captcha.service"

import type { PinoLogger } from "nestjs-pino"

/** 验证码控制器 */
@Controller("captcha")
export class CaptchaController {

    /** 日志记录器 */
    @InjectPinoLogger(CaptchaController.name)
    private readonly logger: PinoLogger

    /** 验证码服务 */
    @Inject(CaptchaService)
    private readonly captchaService: CaptchaService

    /**
     * 获取验证码
     *
     * @returns {Promise<GetResponseDto>} 获取验证码 响应 DTO
     */
    @Public()
    @Get("get")
    public async get (): Promise<GetResponseDto> {

        this.logger.info("[get] started")
        const data = await this.captchaService.get()
        this.logger.info("[get] completed")
        return data

    }

}
