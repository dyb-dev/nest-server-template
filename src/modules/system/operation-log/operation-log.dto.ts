/*
 * @FileDesc: 操作日志 DTO
 */

import { IntersectionType } from "@nestjs/mapped-types"
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ArrayMinSize } from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"

/** 获取操作日志列表 请求 DTO */
export class GetListRequestDto {

    /** 请求ID */
    @IsString({ message: "请求ID必须是字符串" })
    @IsOptional()
    requestId?: string

    /** 用户名 */
    @IsString({ message: "用户名必须是字符串" })
    @IsOptional()
    username?: string

    /** IP 地址 */
    @IsString({ message: "IP 地址必须是字符串" })
    @IsOptional()
    ip?: string

    /** 是否成功 */
    @IsBoolean({ message: "是否成功必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isSuccess?: boolean

    /** 操作开始时间 */
    @IsString({ message: "操作开始时间必须是字符串" })
    @IsOptional()
    operatedAtStart?: string

    /** 操作结束时间 */
    @IsString({ message: "操作结束时间必须是字符串" })
    @IsOptional()
    operatedAtEnd?: string

}

/** 获取分页操作日志列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 批量删除操作日志 请求 DTO */
export class BatchDeleteRequestDto {

    /** 日志ID数组 */
    @IsInt({ each: true, message: "日志ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一条日志" })
    @IsArray({ message: "日志ID必须是数组" })
    ids: number[]

}
