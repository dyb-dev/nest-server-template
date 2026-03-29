/*
 * @FileDesc: 用户 DTO
 */

import { PickType, IntersectionType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsInt,
    MinLength,
    MaxLength,
    IsPhoneNumber,
    Matches,
    IsArray,
    ArrayMinSize
} from "class-validator"

import { IsPassword, ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"
import { UserGender } from "@/prisma/client"

/** 获取用户列表 请求 DTO */
export class GetListRequestDto {

    /** 部门ID */
    @IsInt({ message: "部门ID必须是整数" })
    @Type(() => Number)
    @IsOptional()
    deptId?: number

    /** 用户名 */
    @IsString({ message: "用户名必须是字符串" })
    @IsOptional()
    username?: string

    /** 邮箱 */
    @IsString({ message: "邮箱必须是字符串" })
    @IsOptional()
    email?: string

    /** 手机号 */
    @IsString({ message: "手机号必须是字符串" })
    @IsOptional()
    phone?: string

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

/** 获取分页用户列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 用户基础信息 DTO */
export class UserBaseDto {

    /** 昵称 */
    @Matches(/^[\u4e00-\u9fa5a-zA-Z0-9._\-\s]+$/, { message: "昵称支持中文、英文、数字和常见符号 . _ - 空格" })
    @MaxLength(20, { message: "昵称最多20个字符" })
    @IsString({ message: "昵称必须是字符串" })
    @IsOptional()
    nickname?: string

    /** 邮箱 */
    @IsEmail({}, { message: "邮箱格式不正确" })
    @MaxLength(50, { message: "邮箱最多50个字符" })
    @IsString({ message: "邮箱必须是字符串" })
    @IsOptional()
    email?: string

    /** 手机号 */
    @IsPhoneNumber("CN", { message: "请输入有效的手机号" })
    @MaxLength(11, { message: "手机号最多11个字符" })
    @IsString({ message: "手机号必须是字符串" })
    @IsOptional()
    phone?: string

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

    /** 性别 */
    @IsEnum(UserGender, { message: "性别必须是有效的枚举值" })
    @IsOptional()
    gender?: UserGender

    /** 部门ID */
    @IsInt({ message: "部门ID必须是整数" })
    @Type(() => Number)
    @IsOptional()
    deptId?: number

    /** 岗位ID数组 */
    @IsInt({ each: true, message: "岗位ID必须是整数" })
    @IsArray({ message: "岗位ID必须是数组" })
    @IsOptional()
    postIds?: number[]

    /** 角色ID数组 */
    @IsInt({ each: true, message: "角色ID必须是整数" })
    @IsArray({ message: "角色ID必须是数组" })
    @IsOptional()
    roleIds?: number[]

    /** 备注 */
    @MaxLength(500, { message: "备注最多500个字符" })
    @IsString({ message: "备注必须是字符串" })
    @IsOptional()
    remark?: string

}

/** 创建用户 请求 DTO */
export class CreateRequestDto extends UserBaseDto {

    /** 用户名 */
    @Matches(/^[a-zA-Z0-9._-]+$/, { message: "用户名仅允许英文字母、数字和特殊符号 . _ -" })
    @MaxLength(20, { message: "用户名最多20个字符" })
    @MinLength(4, { message: "用户名至少4个字符" })
    @IsNotEmpty({ message: "用户名不能为空" })
    @IsString({ message: "用户名必须是字符串" })
    username: string

    /** 密码 */
    @IsPassword()
    password: string

}

/** 更新用户 请求 DTO */
export class UpdateRequestDto extends UserBaseDto {

    /** 用户ID */
    @IsInt({ message: "用户ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取用户详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 重置用户密码 请求 DTO */
export class ResetPasswordRequestDto extends IntersectionType(
    PickType(UpdateRequestDto, ["id"]),
    PickType(CreateRequestDto, ["password"])
) {}

/** 更新用户状态 请求 DTO */
export class UpdateStatusRequestDto extends PickType(UpdateRequestDto, ["id"]) {

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    isActive: boolean

}

/** 删除用户 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 批量删除用户 请求 DTO */
export class BatchDeleteRequestDto {

    /** 用户ID数组 */
    @IsInt({ each: true, message: "用户ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一个用户" })
    @IsArray({ message: "用户ID必须是数组" })
    ids: number[]

}
