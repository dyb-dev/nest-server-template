/*
 * @FileDesc: 登录会话 DTO
 */

import { IntersectionType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString } from "class-validator"

import { PaginationRequestDto } from "@/dtos"

/** 获取登录会话列表 请求 DTO */
export class GetListRequestDto {

    /** IP 地址 */
    @IsString({ message: "IP 地址必须是字符串" })
    @IsOptional()
    ip?: string

    /** 用户名 */
    @IsString({ message: "用户名必须是字符串" })
    @IsOptional()
    username?: string

}

/** 获取分页登录会话列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 删除登录会话 请求 DTO */
export class DeleteRequestDto {

    /** 会话ID */
    @IsInt({ message: "会话ID必须是整数" })
    @Type(() => Number)
    id: number

}
