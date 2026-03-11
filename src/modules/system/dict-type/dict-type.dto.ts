/*
 * @FileDesc: 字典类型 DTO
 */

import { IntersectionType, PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, MaxLength, IsArray, ArrayMinSize } from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"

/** 获取字典类型列表 请求 DTO */
export class GetListRequestDto {

    /** 名称 */
    @IsString({ message: "名称必须是字符串" })
    @IsOptional()
    name?: string

    /** 代码 */
    @IsString({ message: "代码必须是字符串" })
    @IsOptional()
    code?: string

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

    /** 创建开始时间 */
    @IsString({ message: "创建开始时间必须是字符串" })
    @IsOptional()
    createdAtStart?: string

    /** 创建结束时间 */
    @IsString({ message: "创建结束时间必须是字符串" })
    @IsOptional()
    createdAtEnd?: string

}

/** 获取分页字典类型列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 创建字典类型 请求 DTO */
export class CreateRequestDto {

    /** 名称 */
    @MaxLength(100, { message: "名称最多100个字符" })
    @IsNotEmpty({ message: "名称不能为空" })
    @IsString({ message: "名称必须是字符串" })
    name: string

    /** 代码 */
    @MaxLength(100, { message: "代码最多100个字符" })
    @IsNotEmpty({ message: "代码不能为空" })
    @IsString({ message: "代码必须是字符串" })
    code: string

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

/** 更新字典类型 请求 DTO */
export class UpdateRequestDto extends CreateRequestDto {

    /** 类型ID */
    @IsInt({ message: "类型ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取字典类型详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 删除字典类型 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 批量删除字典类型 请求 DTO */
export class BatchDeleteRequestDto {

    /** 类型ID数组 */
    @IsInt({ each: true, message: "类型ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一个字典类型" })
    @IsArray({ message: "类型ID必须是数组" })
    ids: number[]

}
