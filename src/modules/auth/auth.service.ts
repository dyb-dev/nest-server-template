/*
 * @FileDesc: 认证服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Transactional } from "@nestjs-cls/transactional"
import dayjs from "dayjs"
import { omit } from "es-toolkit"
import { InjectPinoLogger } from "nestjs-pino"

import { BusinessLogicException, RefreshTokenException } from "@/exceptions"

import { DatabaseService } from "../core"
import { CaptchaService, CsrfService } from "../shared"
import { LoginLogService, LoginSessionService, UserService } from "../system"

import { LoginRequestDto } from "./auth.dto"

import type { SysUser } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Dayjs } from "dayjs"
import type { CookieOptions, Request, Response } from "express"
import type { PinoLogger } from "nestjs-pino"

/** JWT 负载 */
interface JwtPayload {
    /** 用户ID */
    sub: number
    /** 用户名 */
    username: string
    /**
     * 过期时间
     * - Unix 时间戳-秒
     */
    exp: number
}

const {
    PROD,
    VITE_ACCESS_TOKEN_COOKIE_NAME,
    VITE_REFRESH_TOKEN_COOKIE_NAME,
    VITE_ACCESS_TOKEN_SECRET,
    VITE_REFRESH_TOKEN_SECRET
} = import.meta.env

/** 认证服务 */
@Injectable()
export class AuthService {

    /** 日志记录器 */
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger

    /** JWT 服务 */
    @Inject(JwtService)
    private readonly jwtService: JwtService

    /** 验证码服务 */
    @Inject(CaptchaService)
    private readonly captchaService: CaptchaService

    /** CSRF 服务 */
    @Inject(CsrfService)
    private readonly csrfService: CsrfService

    /** 登录日志服务 */
    @Inject(LoginLogService)
    private readonly loginLogService: LoginLogService

    /** 登录会话服务 */
    @Inject(LoginSessionService)
    private readonly loginSessionService: LoginSessionService

    /** 用户服务 */
    @Inject(UserService)
    private readonly userService: UserService

    /** Cookie 配置选项 */
    private readonly COOKIE_OPTIONS: CookieOptions = {
        // 仅同源请求携带
        sameSite: "strict",
        // 整个站点可访问，如需子域访问需设置 domain 属性
        path: "/",
        // 是否仅在 HTTPS 下携带
        secure: PROD,
        // 是否禁止 JS 访问
        httpOnly: true
    }

    /**
     * 用户登录
     *
     * @param {Request} request 请求对象
     * @param {Response} response 响应对象
     * @param {LoginRequestDto} params 登录参数
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">>} 用户信息
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async login (
        request: Request,
        response: Response,
        params: LoginRequestDto
    ): Promise<Omit<SysUser, "password" | "deletedAt">> {

        // 审计字段
        let userId: number | null = null
        let username: string | null = null
        const { clientIp: ip, location, browser, os } = request

        try {

            this.logger.info("[login] started")

            // 验证验证码
            await this.captchaService.validate(params.captchaKey, params.captchaCode)

            // 验证用户是否存在
            const user = await this.userService.findByUsername(params.username)
            if (!user) {

                throw new BusinessLogicException("用户名或密码错误")

            }

            userId = user.id
            username = user.username
            // 将用户信息挂载到 request 上，供操作日志使用
            request.user = { id: user.id, username: user.username }

            // 验证用户状态
            if (!user.isActive) {

                throw new BusinessLogicException("账号已被禁用,请联系管理员")

            }

            // 验证密码
            const isPasswordValid = await this.userService.validatePassword(params.password, user.password)
            if (!isPasswordValid) {

                throw new BusinessLogicException("用户名或密码错误")

            }

            /** 当前时间 */
            const now = dayjs()

            // 获取 访问令牌 和 刷新令牌 的过期时间
            const accessTokenExpiresAt = this.getAccessTokenExpiresAt(now)
            const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt(now)

            // 生成 访问令牌 和 刷新令牌
            const [accessToken, refreshToken] = await Promise.all([
                this.generateAccessToken(user.id, user.username, accessTokenExpiresAt.unix()),
                this.generateRefreshToken(user.id, user.username, refreshTokenExpiresAt.unix())
            ])

            // 清除该用户所有登录会话记录（确保单设备在线）
            await this.loginSessionService.deleteByUserId(user.id)

            // 创建登录会话记录
            await this.loginSessionService.create({
                userId,
                username,
                deptName: user.dept?.name,
                refreshToken,
                ip,
                location,
                browser,
                os,
                expiresAt: refreshTokenExpiresAt.toDate()
            })

            // 创建登录日志记录
            this.loginLogService.create({
                userId,
                username,
                ip,
                location,
                browser,
                os,
                isSuccess: true,
                message: "登录成功"
            })

            // 设置 访问令牌 Cookie 和 CSRF Token
            this.setAccessTokenCookie(request, response, accessToken)
            // 设置 刷新令牌 Cookie
            this.setRefreshTokenCookie(response, refreshToken)

            this.logger.info("[login] completed")

            return omit(user, ["password"])

        }
        catch (error) {

            // 创建登录日志记录
            this.loginLogService.create({
                userId,
                username,
                ip,
                location,
                browser,
                os,
                isSuccess: false,
                message: (error as Error).message || "登录失败"
            })

            throw error

        }

    }

    /**
     * 刷新访问令牌和刷新令牌
     * - 注意：不支持并发刷新，前端需通过请求队列确保同一时刻只有一个刷新请求
     *
     * @param {Request} request 请求对象
     * @param {Response} response 响应对象
     * @param {string} refreshToken 刷新令牌
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async refreshTokens (request: Request, response: Response, refreshToken?: string): Promise<void> {

        this.logger.info("[refreshTokens] started")

        // 验证刷新令牌是否存在
        if (!refreshToken) {

            throw new RefreshTokenException("刷新令牌不存在,请重新登录")

        }

        // 验证刷新令牌是否过期
        const payload = await this.verifyRefreshToken(refreshToken)
        if (!payload) {

            throw new RefreshTokenException("刷新令牌无效或已过期,请重新登录")

        }

        // 将用户信息挂载到 request 上，供操作日志使用
        request.user = { id: payload.sub, username: payload.username }

        // 验证刷新令牌是否存在于 登录会话记录 中
        const loginSession = await this.loginSessionService.findByRefreshToken(refreshToken)
        if (!loginSession) {

            throw new RefreshTokenException("刷新令牌无效或已过期,请重新登录")

        }

        // 验证用户是否存在
        const user = await this.userService.findByUsername(payload.username)
        if (!user) {

            throw new RefreshTokenException("用户不存在,请重新登录")

        }
        // 验证用户状态
        if (!user.isActive) {

            throw new RefreshTokenException("账号已被禁用,请联系管理员")

        }
        // 验证密码是否被修改
        if (dayjs(user.passwordUpdatedAt).isAfter(dayjs(loginSession.loginAt))) {

            throw new RefreshTokenException("密码已修改,请重新登录")

        }

        /** 当前时间 */
        const now = dayjs()

        // 获取 新访问令牌 的过期时间
        const newAccessTokenExpiresAt = this.getAccessTokenExpiresAt(now)

        // 生成 新访问令牌 和 新刷新令牌（使用原 payload 的过期时间）
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.generateAccessToken(payload.sub, payload.username, newAccessTokenExpiresAt.unix()),
            this.generateRefreshToken(payload.sub, payload.username, payload.exp)
        ])

        // 更新 登录会话记录 中的刷新令牌
        await this.loginSessionService.updateRefreshToken({
            id: loginSession.id,
            refreshToken: newRefreshToken
        })

        // 设置访问令牌 Cookie 和 CSRF Token
        this.setAccessTokenCookie(request, response, newAccessToken)
        // 设置新的刷新令牌 Cookie
        this.setRefreshTokenCookie(response, newRefreshToken)

        this.logger.info("[refreshTokens] completed")

    }

    /**
     * 用户登出
     *
     * @param {Response} response 响应对象
     * @param {string} refreshToken 刷新令牌
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async logout (response: Response, refreshToken?: string): Promise<void> {

        this.logger.info("[logout] started")

        // 删除当前登录会话记录
        if (refreshToken) {

            await this.loginSessionService.deleteByRefreshToken(refreshToken)

        }

        // 清除 CSRF Token Cookie
        this.csrfService.clearCsrfToken(response)
        // 清除 访问令牌 Cookie
        response.clearCookie(VITE_ACCESS_TOKEN_COOKIE_NAME, this.COOKIE_OPTIONS)
        // 清除 刷新令牌 Cookie
        response.clearCookie(VITE_REFRESH_TOKEN_COOKIE_NAME, this.COOKIE_OPTIONS)

        this.logger.info("[logout] completed")

    }

    /**
     * 验证访问令牌
     *
     * @param {string} accessToken 访问令牌
     * @returns {Promise<JwtPayload | null>} JWT 负载
     */
    public async verifyAccessToken (accessToken: string): Promise<JwtPayload | null> {

        try {

            const payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
                secret: VITE_ACCESS_TOKEN_SECRET
            })

            return payload

        }
        catch {

            return null

        }

    }

    /**
     * 验证刷新令牌
     *
     * @param {string} refreshToken 刷新令牌
     * @returns {Promise<JwtPayload | null>} JWT 负载
     */
    private async verifyRefreshToken (refreshToken: string): Promise<JwtPayload | null> {

        try {

            const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
                secret: VITE_REFRESH_TOKEN_SECRET
            })

            return payload

        }
        catch {

            return null

        }

    }

    /**
     * 获取访问令牌过期时间
     *
     * @param {Dayjs} baseTime 基准时间
     * @returns {Dayjs} 过期时间
     */
    private getAccessTokenExpiresAt (baseTime: Dayjs): Dayjs {

        return baseTime.add(2, "hour")

    }

    /**
     * 获取刷新令牌过期时间
     *
     * @param {Dayjs} baseTime 基准时间
     * @returns {Dayjs} 过期时间
     */
    private getRefreshTokenExpiresAt (baseTime: Dayjs): Dayjs {

        return baseTime.add(7, "day")

    }

    /**
     * 生成访问令牌
     *
     * @param {number} sub 用户ID
     * @param {string} username 用户名
     * @param {number} exp 过期时间（Unix时间戳-秒）
     * @returns {Promise<string>} 访问令牌
     */
    private generateAccessToken (sub: number, username: string, exp: number): Promise<string> {

        return this.jwtService.signAsync({ sub, username, exp }, { secret: VITE_ACCESS_TOKEN_SECRET })

    }

    /**
     * 生成刷新令牌
     *
     * @param {number} sub 用户ID
     * @param {string} username 用户名
     * @param {number} exp 过期时间（Unix时间戳-秒）
     * @returns {Promise<string>} 刷新令牌
     */
    private generateRefreshToken (sub: number, username: string, exp: number): Promise<string> {

        return this.jwtService.signAsync({ sub, username, exp }, { secret: VITE_REFRESH_TOKEN_SECRET })

    }

    /**
     * 设置访问令牌 Cookie 和 CSRF Token
     *
     * @param {Request} request 请求对象
     * @param {Response} response 响应对象
     * @param {string} accessToken 访问令牌
     * @returns {void}
     */
    private setAccessTokenCookie (request: Request, response: Response, accessToken: string): void {

        // 作用于 `getSessionIdentifier` 中将 访问令牌 与 CSRF Token 绑定
        request.cookies[VITE_ACCESS_TOKEN_COOKIE_NAME] = accessToken
        // 生成并设置 CSRF Token
        this.csrfService.generateCsrfToken(request, response, {
            // 强制生成新 token，与 访问令牌 保持同步
            overwrite: true
        })

        // 设置访问令牌 Cookie
        response.cookie(VITE_ACCESS_TOKEN_COOKIE_NAME, accessToken, this.COOKIE_OPTIONS)

    }

    /**
     * 设置刷新令牌 Cookie
     *
     * @param {Response} response 响应对象
     * @param {string} refreshToken 刷新令牌
     * @returns {void}
     */
    private setRefreshTokenCookie (response: Response, refreshToken: string): void {

        response.cookie(VITE_REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.COOKIE_OPTIONS)

    }

}
