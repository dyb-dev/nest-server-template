/*
 * @FileDesc: 参数配置 DTO
 */

import { IntersectionType, PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, MaxLength, IsArray, ArrayMinSize } from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"

/** 获取参数配置列表 请求 DTO */
export class GetListRequestDto {

    /** 名称 */
    @IsString({ message: "名称必须是字符串" })
    @IsOptional()
    name?: string

    /** 键 */
    @IsString({ message: "键必须是字符串" })
    @IsOptional()
    key?: string

    /** 是否系统内置 */
    @IsBoolean({ message: "是否系统内置必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isSystem?: boolean

    /** 创建开始时间 */
    @IsString({ message: "创建开始时间必须是字符串" })
    @IsOptional()
    createdAtStart?: string

    /** 创建结束时间 */
    @IsString({ message: "创建结束时间必须是字符串" })
    @IsOptional()
    createdAtEnd?: string

}

/** 获取分页参数配置列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 创建参数配置 请求 DTO */
export class CreateRequestDto {

    /** 名称 */
    @MaxLength(100, { message: "名称最多100个字符" })
    @IsNotEmpty({ message: "名称不能为空" })
    @IsString({ message: "名称必须是字符串" })
    name: string

    /** 键 */
    @MaxLength(100, { message: "键最多100个字符" })
    @IsNotEmpty({ message: "键不能为空" })
    @IsString({ message: "键必须是字符串" })
    key: string

    /** 值 */
    @IsNotEmpty({ message: "值不能为空" })
    @IsString({ message: "值必须是字符串" })
    value: string

    /** 备注 */
    @MaxLength(500, { message: "备注最多500个字符" })
    @IsString({ message: "备注必须是字符串" })
    @IsOptional()
    remark?: string

}

/** 更新参数配置 请求 DTO */
export class UpdateRequestDto extends CreateRequestDto {

    /** 配置ID */
    @IsInt({ message: "配置ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取参数配置详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 删除参数配置 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 批量删除参数配置 请求 DTO */
export class BatchDeleteRequestDto {

    /** 配置ID数组 */
    @IsInt({ each: true, message: "配置ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一个配置" })
    @IsArray({ message: "配置ID必须是数组" })
    ids: number[]

}
