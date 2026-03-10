/*
 * @FileDesc: 登录日志 DTO
 */

import { IntersectionType } from "@nestjs/mapped-types"
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ArrayMinSize } from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"

/** 获取登录日志列表 请求 DTO */
export class GetListRequestDto {

    /** IP 地址 */
    @IsString({ message: "IP 地址必须是字符串" })
    @IsOptional()
    ip?: string

    /** 用户名 */
    @IsString({ message: "用户名必须是字符串" })
    @IsOptional()
    username?: string

    /** 是否成功 */
    @IsBoolean({ message: "是否成功必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isSuccess?: boolean

    /** 登录开始时间 */
    @IsString({ message: "登录开始时间必须是字符串" })
    @IsOptional()
    loginAtStart?: string

    /** 登录结束时间 */
    @IsString({ message: "登录结束时间必须是字符串" })
    @IsOptional()
    loginAtEnd?: string

}

/** 获取分页登录日志列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 批量删除登录日志 请求 DTO */
export class BatchDeleteRequestDto {

    /** 日志ID数组 */
    @IsInt({ each: true, message: "日志ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一条日志" })
    @IsArray({ message: "日志ID必须是数组" })
    ids: number[]

}
