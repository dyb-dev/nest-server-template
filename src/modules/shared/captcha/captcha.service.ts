/*
 * @FileDesc: 验证码服务
 */

import { randomUUID } from "node:crypto"

import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"
import { createMathExpr } from "svg-captcha"

import { BusinessLogicException } from "@/exceptions"

import { GetResponseDto } from "./captcha.dto"

import type { Cache } from "@nestjs/cache-manager"
import type { PinoLogger } from "nestjs-pino"

/** 验证码服务 */
@Injectable()
export class CaptchaService {

    /** 日志记录器 */
    @InjectPinoLogger(CaptchaService.name)
    private readonly logger: PinoLogger

    /** 缓存管理器 */
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache

    /**
     * 获取验证码
     *
     * @returns {Promise<GetResponseDto>} 获取验证码 响应 DTO
     */
    public async get (): Promise<GetResponseDto> {

        this.logger.info("[get] started")

        /** 验证码唯一标识 */
        const captchaKey = randomUUID()
        /** 缓存 Key */
        const cacheKey = this.getCacheKey(captchaKey)

        /** 算术验证码 */
        const captcha = createMathExpr({
            // 宽度
            width: 100,
            // 高度
            height: 40,
            // 字体大小
            fontSize: 60,
            // 背景色
            background: "#f0f0f0",
            // 验证码字符是否有颜色
            color: true
        })

        // 存入缓存 (5分钟过期)
        await this.cacheManager.set(cacheKey, captcha.text, 300 * 1000)

        this.logger.info("[get] completed")

        return {
            key: captchaKey,
            image: captcha.data
        }

    }

    /**
     * 验证验证码
     *
     * @param {string} key 验证码 Key
     * @param {string} code 用户输入的验证码
     * @returns {Promise<boolean>} 是否验证通过
     */
    public async validate (key: string, code: string): Promise<boolean> {

        /** 缓存 Key */
        const cacheKey = this.getCacheKey(key)
        /** 缓存中的验证码 */
        const storedCode = await this.cacheManager.get<string>(cacheKey)

        // 验证码不存在或已过期
        if (!storedCode) {

            throw new BusinessLogicException("验证码已失效，请重新获取")

        }

        // 验证码错误
        if (storedCode !== code) {

            throw new BusinessLogicException("验证码错误")

        }

        // 验证成功后删除验证码（一次性使用）
        await this.cacheManager.del(cacheKey)

        return true

    }

    /**
     * 获取缓存 Key
     *
     * @param {string} key 验证码 Key
     * @returns {string} 缓存 Key
     */
    private getCacheKey (key: string): string {

        return `captcha:${key}`

    }

}
