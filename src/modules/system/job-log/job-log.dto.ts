/*
 * @FileDesc: 定时任务日志 DTO
 */

import { IntersectionType } from "@nestjs/mapped-types"
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ArrayMinSize } from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"

/** 获取定时任务日志列表 请求 DTO */
export class GetListRequestDto {

    /** 任务名称 */
    @IsString({ message: "任务名称必须是字符串" })
    @IsOptional()
    name?: string

    /** 是否系统任务 */
    @IsBoolean({ message: "是否系统任务必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isSystem?: boolean

    /** 是否执行成功 */
    @IsBoolean({ message: "是否执行成功必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isSuccess?: boolean

    /** 执行开始时间 */
    @IsString({ message: "执行开始时间必须是字符串" })
    @IsOptional()
    executedAtStart?: string

    /** 执行结束时间 */
    @IsString({ message: "执行结束时间必须是字符串" })
    @IsOptional()
    executedAtEnd?: string

}

/** 获取分页定时任务日志列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 批量删除定时任务日志 请求 DTO */
export class BatchDeleteRequestDto {

    /** 日志ID数组 */
    @IsInt({ each: true, message: "日志ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一条日志" })
    @IsArray({ message: "日志ID必须是数组" })
    ids: number[]

}
