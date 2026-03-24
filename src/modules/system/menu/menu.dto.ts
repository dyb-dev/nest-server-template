/*
 * @FileDesc: 菜单 DTO
 */

import { PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

import { ToBoolean } from "@/decorators"
import { SysMenuType } from "@/prisma/client"

/** 获取菜单列表 请求 DTO */
export class GetListRequestDto {

    /** 菜单名称 */
    @IsString({ message: "菜单名称必须是字符串" })
    @IsOptional()
    name?: string

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

}

/** 创建菜单 请求 DTO */
export class CreateRequestDto {

    /** 父级菜单ID */
    @IsInt({ message: "父级菜单ID必须是整数" })
    @Type(() => Number)
    @IsOptional()
    parentId?: number

    /** 菜单类型 */
    @IsEnum(SysMenuType, { message: "菜单类型必须是有效的枚举值" })
    @IsNotEmpty({ message: "菜单类型不能为空" })
    type: SysMenuType

    /** 名称 */
    @MaxLength(50, { message: "菜单名称最多50个字符" })
    @IsNotEmpty({ message: "菜单名称不能为空" })
    @IsString({ message: "菜单名称必须是字符串" })
    name: string

    /** 图标（Catalog/Menu 可用） */
    @MaxLength(100, { message: "图标最多100个字符" })
    @IsString({ message: "图标必须是字符串" })
    @IsOptional()
    icon?: string

    /** 路由名称（Menu 专用） */
    @MaxLength(50, { message: "路由名称最多50个字符" })
    @IsString({ message: "路由名称必须是字符串" })
    @IsOptional()
    routeName?: string

    /** 路径（Catalog/Menu 可用） */
    @MaxLength(200, { message: "路径最多200个字符" })
    @IsString({ message: "路径必须是字符串" })
    @IsOptional()
    path?: string

    /** 组件路径（Menu 专用） */
    @MaxLength(255, { message: "组件路径最多255个字符" })
    @IsString({ message: "组件路径必须是字符串" })
    @IsOptional()
    component?: string

    /** 权限标识（Menu/Button 可用） */
    @MaxLength(100, { message: "权限标识最多100个字符" })
    @IsString({ message: "权限标识必须是字符串" })
    @IsOptional()
    perms?: string

    /** 是否外链（Catalog/Menu 可用） */
    @IsBoolean({ message: "是否外链必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isExternal?: boolean

    /** 是否显示（Catalog/Menu 可用） */
    @IsBoolean({ message: "是否显示必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isVisible?: boolean

    /** 是否缓存（Menu 专用） */
    @IsBoolean({ message: "是否缓存必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isCache?: boolean

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

    /** 排序 */
    @IsInt({ message: "排序必须是整数" })
    @Type(() => Number)
    @IsOptional()
    sort?: number

    /** 备注 */
    @MaxLength(500, { message: "备注最多500个字符" })
    @IsString({ message: "备注必须是字符串" })
    @IsOptional()
    remark?: string

}

/** 更新菜单 请求 DTO */
export class UpdateRequestDto extends CreateRequestDto {

    /** 菜单ID */
    @IsInt({ message: "菜单ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取菜单详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 删除菜单 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}
