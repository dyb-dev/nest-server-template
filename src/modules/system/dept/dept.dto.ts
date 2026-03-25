/*
 * @FileDesc: 部门 DTO
 */

import { PickType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator"

import { ToBoolean } from "@/decorators"

/** 获取部门列表 请求 DTO */
export class GetListRequestDto {

    /** 部门名称 */
    @IsString({ message: "部门名称必须是字符串" })
    @IsOptional()
    name?: string

    /** 是否激活 */
    @IsBoolean({ message: "是否激活必须是布尔值" })
    @ToBoolean()
    @IsOptional()
    isActive?: boolean

}

/** 获取部门树 请求 DTO */
export class GetTreeRequestDto extends GetListRequestDto {}

/** 创建部门 请求 DTO */
export class CreateRequestDto {

    /** 父级部门ID */
    @IsInt({ message: "父级部门ID必须是整数" })
    @Type(() => Number)
    @IsOptional()
    parentId?: number

    /** 名称 */
    @MaxLength(30, { message: "部门名称最多30个字符" })
    @IsNotEmpty({ message: "部门名称不能为空" })
    @IsString({ message: "部门名称必须是字符串" })
    name: string

    /** 排序 */
    @IsInt({ message: "排序必须是整数" })
    @Type(() => Number)
    @IsOptional()
    sort?: number

    /** 负责人ID */
    @IsInt({ message: "负责人ID必须是整数" })
    @Type(() => Number)
    @IsOptional()
    leaderId?: number

    /** 部门电话 */
    @IsPhoneNumber("CN", { message: "请输入有效的电话号码" })
    @MaxLength(20, { message: "电话号码最多20个字符" })
    @IsString({ message: "电话号码必须是字符串" })
    @IsOptional()
    phone?: string

    /** 部门邮箱 */
    @IsEmail({}, { message: "邮箱格式不正确" })
    @MaxLength(50, { message: "邮箱最多50个字符" })
    @IsString({ message: "邮箱必须是字符串" })
    @IsOptional()
    email?: string

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

/** 更新部门 请求 DTO */
export class UpdateRequestDto extends CreateRequestDto {

    /** 部门ID */
    @IsInt({ message: "部门ID必须是整数" })
    @Type(() => Number)
    id: number

}

/** 获取部门详情 请求 DTO */
export class GetDetailRequestDto extends PickType(UpdateRequestDto, ["id"]) {}

/** 删除部门 请求 DTO */
export class DeleteRequestDto extends PickType(UpdateRequestDto, ["id"]) {}
