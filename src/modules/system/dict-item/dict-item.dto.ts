/*
 * @FileDesc: 字典项 DTO
 */

import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsInt,
    IsNumber,
    MaxLength,
    IsArray,
    ArrayMinSize,
    Min
} from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"

/** 获取字典项列表 请求 DTO */
export class GetListRequestDto {

    /** 字典类型ID */
    @IsInt({ message: "字典类型ID必须是整数" })
    @Type(() => Number)
    typeId: number

    /** 标签 */
    @IsString({ message: "标签必须是字符串" })
    @IsOptional()
    label?: string

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

}

/** 获取分页字典项列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 创建字典项 请求 DTO */
export class CreateRequestDto {

    /** 字典类型ID */
    @IsInt({ message: "字典类型ID必须是整数" })
    @Type(() => Number)
    typeId: number

    /** 标签 */
    @MaxLength(100, { message: "标签最多100个字符" })
    @IsNotEmpty({ message: "标签不能为空" })
    @IsString({ message: "标签必须是字符串" })
    label: string

    /** 值 */
    @MaxLength(100, { message: "值最多100个字符" })
    @IsNotEmpty({ message: "值不能为空" })
    @IsString({ message: "值必须是字符串" })
    value: string

    /** CSS 样式类 */
    @MaxLength(100, { message: "CSS样式类最多100个字符" })
    @IsString({ message: "CSS样式类必须是字符串" })
    @IsOptional()
    cssClass?: string

    /** 列表样式类 */
    @MaxLength(100, { message: "列表样式类最多100个字符" })
    @IsString({ message: "列表样式类必须是字符串" })
    @IsOptional()
    listClass?: string

    /** 是否默认 */
    @IsBoolean({ message: "是否默认必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isDefault?: boolean

    /** 排序 */
    @Min(0, { message: "排序不能小于0" })
    @IsNumber({}, { message: "排序必须是数字" })
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

/** 更新字典项 请求 DTO */
export class UpdateRequestDto extends OmitType(CreateRequestDto, ["typeId"]) {

    /** 字典项ID */
    @IsInt({ message: "字典项ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取字典项详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 删除字典项 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 批量删除字典项 请求 DTO */
export class BatchDeleteRequestDto {

    /** 字典项ID数组 */
    @IsInt({ each: true, message: "字典项ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一个字典项" })
    @IsArray({ message: "字典项ID必须是数组" })
    ids: number[]

}
