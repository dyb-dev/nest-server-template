/*
 * @FileDesc: 通知公告 DTO
 */

import { IntersectionType, PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsArray, ArrayMinSize, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"
import { SysNoticeType } from "@/prisma/client"

/** 获取通知公告列表 请求 DTO */
export class GetListRequestDto {

    /** 标题 */
    @IsString({ message: "标题必须是字符串" })
    @IsOptional()
    title?: string

    /** 类型 */
    @IsEnum(SysNoticeType, { message: "类型必须是有效的枚举值" })
    @IsOptional()
    type?: SysNoticeType

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

}

/** 获取分页通知公告列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 创建通知公告 请求 DTO */
export class CreateRequestDto {

    /** 标题 */
    @MaxLength(50, { message: "标题最多50个字符" })
    @IsNotEmpty({ message: "标题不能为空" })
    @IsString({ message: "标题必须是字符串" })
    title: string

    /** 内容（富文本） */
    @IsNotEmpty({ message: "内容不能为空" })
    @IsString({ message: "内容必须是字符串" })
    content: string

    /** 类型 */
    @IsEnum(SysNoticeType, { message: "类型必须是有效的枚举值" })
    @IsNotEmpty({ message: "类型不能为空" })
    type: SysNoticeType

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

/** 更新通知公告 请求 DTO */
export class UpdateRequestDto extends CreateRequestDto {

    /** 公告ID */
    @IsInt({ message: "公告ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取通知公告详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 删除通知公告 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 批量删除通知公告 请求 DTO */
export class BatchDeleteRequestDto {

    /** 公告ID数组 */
    @IsInt({ each: true, message: "公告ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一条公告" })
    @IsArray({ message: "公告ID必须是数组" })
    ids: number[]

}
