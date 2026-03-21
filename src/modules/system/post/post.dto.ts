/*
 * @FileDesc: 岗位 DTO
 */

import { IntersectionType, PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsArray, ArrayMinSize, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"

/** 获取岗位列表 请求 DTO */
export class GetListRequestDto {

    /** 岗位名称 */
    @IsString({ message: "岗位名称必须是字符串" })
    @IsOptional()
    name?: string

    /** 岗位代码 */
    @IsString({ message: "岗位代码必须是字符串" })
    @IsOptional()
    code?: string

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

}

/** 获取分页岗位列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 创建岗位 请求 DTO */
export class CreateRequestDto {

    /** 岗位名称 */
    @MaxLength(50, { message: "岗位名称最多50个字符" })
    @IsNotEmpty({ message: "岗位名称不能为空" })
    @IsString({ message: "岗位名称必须是字符串" })
    name: string

    /** 岗位代码 */
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: "岗位代码仅允许英文字母、数字和特殊符号 _ -" })
    @MaxLength(64, { message: "岗位代码最多64个字符" })
    @IsNotEmpty({ message: "岗位代码不能为空" })
    @IsString({ message: "岗位代码必须是字符串" })
    code: string

    /** 排序 */
    @IsInt({ message: "排序必须是整数" })
    @Type(() => Number)
    @IsOptional()
    sort?: number

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

/** 更新岗位 请求 DTO */
export class UpdateRequestDto extends CreateRequestDto {

    /** 岗位ID */
    @IsInt({ message: "岗位ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取岗位详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 删除岗位 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 批量删除岗位 请求 DTO */
export class BatchDeleteRequestDto {

    /** 岗位ID数组 */
    @IsInt({ each: true, message: "岗位ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一个岗位" })
    @IsArray({ message: "岗位ID必须是数组" })
    ids: number[]

}
