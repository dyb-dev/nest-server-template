/*
 * @FileDesc: 定时任务 DTO
 */

import { IntersectionType, PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, MaxLength, IsArray, ArrayMinSize } from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"

import { IsCronExpression } from "./job.decorator"

/** 获取定时任务列表 请求 DTO */
export class GetListRequestDto {

    /** 名称 */
    @IsString({ message: "名称必须是字符串" })
    @IsOptional()
    name?: string

    /** 是否系统任务 */
    @IsBoolean({ message: "是否系统任务必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isSystem?: boolean

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

}

/** 获取分页定时任务列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 创建定时任务 请求 DTO */
export class CreateRequestDto {

    /** 名称 */
    @MaxLength(100, { message: "名称最多100个字符" })
    @IsNotEmpty({ message: "名称不能为空" })
    @IsString({ message: "名称必须是字符串" })
    name: string

    /** 调用目标 */
    @MaxLength(100, { message: "调用目标最多100个字符" })
    @IsNotEmpty({ message: "调用目标不能为空" })
    @IsString({ message: "调用目标必须是字符串" })
    invokeTarget: string

    /** Cron表达式 */
    @IsCronExpression()
    @MaxLength(100, { message: "Cron表达式最多100个字符" })
    @IsNotEmpty({ message: "Cron表达式不能为空" })
    @IsString({ message: "Cron表达式必须是字符串" })
    cronExpression: string

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

    /** 备注 */
    @MaxLength(500, { message: "备注最多500个字符" })
    @IsString({ message: "备注必须是字符串" })
    @IsOptional()
    remark?: string

}

/** 更新定时任务 请求 DTO */
export class UpdateRequestDto extends CreateRequestDto {

    /** 任务ID */
    @IsInt({ message: "任务ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 更新定时任务状态 请求 DTO */
export class UpdateStatusRequestDto extends PickType(UpdateRequestDto, ["id"]) {

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    isActive: boolean

}

/** 获取定时任务详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 删除定时任务 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 批量删除定时任务 请求 DTO */
export class BatchDeleteRequestDto {

    /** 任务ID数组 */
    @IsInt({ each: true, message: "任务ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一个定时任务" })
    @IsArray({ message: "任务ID必须是数组" })
    ids: number[]

}

/** 执行定时任务 请求 DTO */
export class RunRequestDto extends PickType(UpdateRequestDto, ["id"]) {}
