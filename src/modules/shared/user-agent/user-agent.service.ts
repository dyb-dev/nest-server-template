/*
 * @FileDesc: UserAgent 服务
 */

import { Injectable } from "@nestjs/common"
import { UAParser } from "ua-parser-js"

/** UserAgent 服务 */
@Injectable()
export class UserAgentService {

    /** UA 解析器实例 */
    private readonly parser: UAParser = new UAParser()

    /**
     * 获取浏览器信息
     *
     * @param {string} userAgent User-Agent 字符串
     * @returns {string | null} 浏览器信息（名称 版本），解析失败返回 null
     */
    public getBrowser (userAgent: string): string | null {

        const browser = this.parser.setUA(userAgent).getBrowser()
        const name = browser.name
        if (!name) {

            return null

        }
        const version = browser.version?.split(".").slice(0, 2).join(".")
        return version ? `${name} ${version}` : name

    }

    /**
     * 获取操作系统信息
     *
     * @param {string} userAgent User-Agent 字符串
     * @returns {string | null} 操作系统信息（名称 版本），解析失败返回 null
     */
    public getOS (userAgent: string): string | null {

        const os = this.parser.setUA(userAgent).getOS()
        const name = os.name
        if (!name) {

            return null

        }
        const version = os.version?.split(".").slice(0, 2).join(".")
        return version ? `${name} ${version}` : name

    }

}
