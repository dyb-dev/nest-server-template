/*
 * @FileDesc: 角色 DTO
 */

import { IntersectionType, PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import {
    IsArray,
    ArrayMinSize,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator"

import { ToBoolean } from "@/decorators"
import { PaginationRequestDto } from "@/dtos"
import { SysRoleDataScope } from "@/prisma/client"

/** 获取角色列表 请求 DTO */
export class GetListRequestDto {

    /** 角色名称 */
    @IsString({ message: "角色名称必须是字符串" })
    @IsOptional()
    name?: string

    /** 角色代码 */
    @IsString({ message: "角色代码必须是字符串" })
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

/** 获取分页角色列表 请求 DTO */
export class GetPageListRequestDto extends IntersectionType(GetListRequestDto, PaginationRequestDto) {}

/** 创建角色 请求 DTO */
export class CreateRequestDto {

    /** 角色名称 */
    @MaxLength(30, { message: "角色名称最多30个字符" })
    @IsNotEmpty({ message: "角色名称不能为空" })
    @IsString({ message: "角色名称必须是字符串" })
    name: string

    /** 角色代码 */
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: "角色代码仅允许英文字母、数字和特殊符号 _ -" })
    @MaxLength(100, { message: "角色代码最多100个字符" })
    @MinLength(2, { message: "角色代码至少2个字符" })
    @IsNotEmpty({ message: "角色代码不能为空" })
    @IsString({ message: "角色代码必须是字符串" })
    code: string

    /** 是否菜单树严格勾选 */
    @IsBoolean({ message: "是否菜单树严格勾选必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isMenuCheckStrict?: boolean

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

    /** 菜单ID集合 */
    @IsInt({ each: true, message: "菜单ID必须是整数" })
    @IsArray({ message: "菜单ID必须是数组" })
    @IsOptional()
    menuIds?: number[]

    /** 备注 */
    @MaxLength(500, { message: "备注最多500个字符" })
    @IsString({ message: "备注必须是字符串" })
    @IsOptional()
    remark?: string

}

/** 更新角色 请求 DTO */
export class UpdateRequestDto extends CreateRequestDto {

    /** 角色ID */
    @IsInt({ message: "角色ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取角色详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 更新角色状态 请求 DTO */
export class UpdateStatusRequestDto extends PickType(UpdateRequestDto, ["id"]) {

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    isActive: boolean

}

/** 更新角色数据权限 请求 DTO */
export class UpdateDataScopeRequestDto extends PickType(UpdateRequestDto, ["id"]) {

    /** 数据范围 */
    @IsEnum(SysRoleDataScope, { message: "数据范围必须是有效的枚举值" })
    dataScope: SysRoleDataScope

    /** 是否部门树严格勾选 */
    @IsBoolean({ message: "是否部门树严格勾选必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isDeptCheckStrict?: boolean

    /** 部门ID集合（仅 dataScope 为 Custom 时生效） */
    @IsInt({ each: true, message: "部门ID必须是整数" })
    @IsArray({ message: "部门ID必须是数组" })
    @IsOptional()
    deptIds?: number[]

}

/** 删除角色 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 批量删除角色 请求 DTO */
export class BatchDeleteRequestDto {

    /** 角色ID数组 */
    @IsInt({ each: true, message: "角色ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一个角色" })
    @IsArray({ message: "角色ID必须是数组" })
    ids: number[]

}

/** 获取角色已绑定用户分页列表 请求 DTO */
export class GetBoundUserPageListRequestDto extends PaginationRequestDto {

    /** 角色ID */
    @IsInt({ message: "角色ID必须是整数" })
    @Type(() => Number)
    roleId: number

    /** 用户名 */
    @IsString({ message: "用户名必须是字符串" })
    @IsOptional()
    username?: string

    /** 手机号 */
    @IsString({ message: "手机号必须是字符串" })
    @IsOptional()
    phone?: string

}

/** 获取角色未绑定用户分页列表 请求 DTO */
export class GetUnboundUserPageListRequestDto extends GetBoundUserPageListRequestDto {}

/** 批量绑定用户 请求 DTO */
export class BatchBindUserRequestDto extends PickType(GetBoundUserPageListRequestDto, ["roleId"]) {

    /** 用户ID数组 */
    @IsInt({ each: true, message: "用户ID必须是整数" })
    @ArrayMinSize(1, { message: "至少选择一个用户" })
    @IsArray({ message: "用户ID必须是数组" })
    userIds: number[]

}

/** 解绑用户 请求 DTO */
export class UnbindUserRequestDto extends PickType(GetBoundUserPageListRequestDto, ["roleId"]) {

    /** 用户ID */
    @IsInt({ message: "用户ID必须是整数" })
    @Type(() => Number)
    userId: number

}

/** 批量解绑用户 请求 DTO */
export class BatchUnbindUserRequestDto extends BatchBindUserRequestDto {}
