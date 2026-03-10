/*
 * @FileDesc: 位置服务
 */

import { HttpService } from "@nestjs/axios"
import { Inject, Injectable } from "@nestjs/common"
import ipaddr from "ipaddr.js"

import type { IPv6 } from "ipaddr.js"

/** 位置服务 */
@Injectable()
export class LocationService {

    /** HTTP 服务 */
    @Inject(HttpService)
    private readonly httpService: HttpService

    /**
     * 根据 IP 地址获取位置
     *
     * @param {string} ip IP 地址
     * @returns {Promise<string | null>} 位置（省 市 区）
     */
    public async getLocationByIp (ip: string): Promise<string | null> {

        try {

            // 非法 IP 或 非公网 IP
            if (!this.isValidIp(ip) || !this.isPublicIp(ip)) {

                return null

            }

            const response = await this.httpService.axiosRef.get<{
                status: number
                content: {
                    address_detail: {
                        province: string
                        city: string
                        district: string
                    }
                }
            }>("https://api.map.baidu.com/location/ip", {
                params: { ip, ak: "82aZMic9b691GPoZnt2TqrpXF5KKeOGx" },
                timeout: 3000
            })

            const data = response.data
            if (data.status !== 0) {

                return null

            }

            const { province, city, district } = data.content.address_detail
            return [province, city, district].filter(Boolean).join(" ")

        }
        catch {

            return null

        }

    }

    /**
     * 是否为合法 IP
     *
     * @param {string} ip IP 地址
     * @returns {boolean} 是否为合法 IP
     */
    private isValidIp (ip: string): boolean {

        return ipaddr.isValid(ip)

    }

    /**
     * 是否为公网 IP
     *
     * @param {string} ip IP 地址
     * @returns {boolean} 是否为公网 IP
     */
    private isPublicIp (ip: string): boolean {

        let addr = ipaddr.parse(ip)
        if (addr.kind() === "ipv6") {

            const v6 = addr as IPv6
            if (v6.isIPv4MappedAddress()) {

                addr = v6.toIPv4Address()

            }

        }
        return addr.range() === "unicast"

    }

}
