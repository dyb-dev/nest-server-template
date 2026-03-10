/*
 * @FileDesc: 响应 DTO
 */

import dayjs from "dayjs"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

import type { HttpStatus } from "@nestjs/common"
import type { Request } from "express"

/** 响应 DTO */
export class ResponseDto {

    /** 是否成功 */
    success: boolean
    /** 业务码 */
    code: HttpStatus | EResponseCode
    /** 消息 */
    message: string
    /** 数据 */
    data: unknown
    /**
     * 日期时间
     * - 格式: YYYY-MM-DD HH:mm:ss
     */
    datetime: string
    /**
     * 请求 id
     * - 类型: UUID
     */
    requestId: Request["requestId"]

    /**
     * 创建成功响应
     *
     * @param {(TModifyProperties<Pick<ResponseDto, "data" | "requestId">, "data">)} params 参数
     * @returns {ResponseDto} 响应 DTO
     */
    static success (params: TModifyProperties<Pick<ResponseDto, "data" | "requestId">, "data">): ResponseDto {

        return {
            ...params,
            success: true,
            code: EResponseCode.Success,
            message: RESPONSE_CODE_TO_MESSAGE[EResponseCode.Success],
            data: params.data ?? null,
            datetime: this.getDatetime()
        }

    }

    /**
     * 创建失败响应
     *
     * @param {(Pick<ResponseDto, "code" | "message" | "requestId">)} params 参数
     * @returns {ResponseDto} 响应 DTO
     */
    static fail (params: Pick<ResponseDto, "code" | "message" | "requestId">): ResponseDto {

        return {
            ...params,
            success: false,
            data: null,
            datetime: this.getDatetime()
        }

    }

    /**
     * 获取当前日期时间字符串
     *
     * @returns {string} 格式: YYYY-MM-DD HH:mm:ss
     */
    private static getDatetime (): string {

        return dayjs().format("YYYY-MM-DD HH:mm:ss")

    }

}
