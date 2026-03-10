/*
 * @FileDesc: CSRF 服务
 */

import { Injectable } from "@nestjs/common"
import { doubleCsrf } from "csrf-csrf"

import type { CsrfTokenGenerator, DoubleCsrfProtection } from "csrf-csrf"
import type { CookieOptions, Response } from "express"

const { PROD, VITE_CSRF_TOKEN_COOKIE_NAME, VITE_ACCESS_TOKEN_COOKIE_NAME, VITE_CSRF_TOKEN_SECRET } = import.meta.env

/** CSRF 服务 */
@Injectable()
export class CsrfService {

    /** 验证 CSRF Token */
    public readonly verifyCsrfToken: DoubleCsrfProtection

    /** 生成并设置 CSRF Token */
    public readonly generateCsrfToken: CsrfTokenGenerator

    /** Cookie 配置选项 */
    private readonly COOKIE_OPTIONS: CookieOptions = {
        // 仅同源请求携带
        sameSite: "strict",
        // 整个站点可访问，如需子域访问需设置 domain 属性
        path: "/",
        // 是否仅在 HTTPS 下携带
        secure: PROD,
        // 是否禁止 JS 访问
        httpOnly: false
    }

    public constructor () {

        // 初始化 CSRF 保护中间件
        const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
            // 获取密钥
            getSecret: () => VITE_CSRF_TOKEN_SECRET,
            // 获取会话标识，将 CSRF Token 与特定用户标识绑定
            getSessionIdentifier: request => request.cookies[VITE_ACCESS_TOKEN_COOKIE_NAME] || "",
            // Cookie 名称
            cookieName: VITE_CSRF_TOKEN_COOKIE_NAME,
            // Cookie 选项
            cookieOptions: this.COOKIE_OPTIONS,
            // 长度
            size: 32,
            // 忽略请求方法
            ignoredMethods: [],
            // 获取请求中的 CSRF Token
            getCsrfTokenFromRequest: request => request.headers[`x-${VITE_CSRF_TOKEN_COOKIE_NAME}`] as string
        })

        this.verifyCsrfToken = doubleCsrfProtection
        this.generateCsrfToken = generateCsrfToken

    }

    /**
     * 清除 CSRF Token Cookie
     *
     * @param {Response} response 响应对象
     * @returns {void}
     */
    public clearCsrfToken (response: Response): void {

        response.clearCookie(VITE_CSRF_TOKEN_COOKIE_NAME, this.COOKIE_OPTIONS)

    }

}
