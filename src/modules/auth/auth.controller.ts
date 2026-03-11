/*
 * @FileDesc: 认证控制器
 */

import { Body, Controller, Inject, Post, Req, Res } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Public, Cookies } from "@/decorators"

import { LoginRequestDto } from "./auth.dto"
import { AuthService } from "./auth.service"

import type { SysUser } from "@/prisma/client"
import type { Request, Response } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 认证控制器 */
@Controller("auth")
export class AuthController {

    /** 日志记录器 */
    @InjectPinoLogger(AuthController.name)
    private readonly logger: PinoLogger

    /** 认证服务 */
    @Inject(AuthService)
    private readonly authService: AuthService

    /**
     * 用户登录
     *
     * @param {Request} request 请求对象
     * @param {Response} response 响应对象
     * @param {LoginRequestDto} body 请求体
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">>} 用户信息
     */
    @Public()
    @Post("login")
    public async login (
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
        @Body() body: LoginRequestDto
    ): Promise<Omit<SysUser, "password" | "deletedAt">> {

        this.logger.info("[login] started")
        const user = await this.authService.login(request, response, body)
        this.logger.info("[login] completed")
        return user

    }

    /**
     * 刷新访问令牌和刷新令牌
     *
     * @param {Request} request 请求对象
     * @param {Response} response 响应对象
     * @param {Record<string, string>} cookies Cookie 对象
     * @returns {Promise<void>}
     */
    @Public()
    @Post("refreshTokens")
    public async refreshTokens (
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
        @Cookies() cookies: Record<string, string>
    ): Promise<void> {

        this.logger.info("[refreshTokens] started")
        await this.authService.refreshTokens(request, response, cookies[this.authService.REFRESH_TOKEN_COOKIE_NAME])
        this.logger.info("[refreshTokens] completed")

    }

    /**
     * 用户登出
     *
     * @param {Response} response 响应对象
     * @param {Record<string, string>} cookies Cookie 对象
     * @returns {Promise<void>}
     */
    @Post("logout")
    public async logout (
        @Res({ passthrough: true }) response: Response,
        @Cookies() cookies: Record<string, string>
    ): Promise<void> {

        this.logger.info("[logout] started")
        await this.authService.logout(response, cookies[this.authService.REFRESH_TOKEN_COOKIE_NAME])
        this.logger.info("[logout] completed")

    }

}
