/*
 * @FileDesc: 个人主页 DTO
 */

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator"

import { IsNickname, IsPassword } from "@/decorators"
import { UserGender } from "@/prisma/client"

/** 更新个人信息 请求 DTO */
export class UpdateInfoRequestDto {

    /** 昵称 */
    @IsNickname()
    @IsOptional()
    nickname?: string

    /** 手机号 */
    @IsPhoneNumber("CN", { message: "请输入有效的手机号" })
    @MaxLength(11, { message: "手机号最多11个字符" })
    @IsString({ message: "手机号必须是字符串" })
    @IsOptional()
    phone?: string

    /** 邮箱 */
    @IsEmail({}, { message: "邮箱格式不正确" })
    @MaxLength(50, { message: "邮箱最多50个字符" })
    @IsString({ message: "邮箱必须是字符串" })
    @IsOptional()
    email?: string

    /** 性别 */
    @IsEnum(UserGender, { message: "性别必须是有效的枚举值" })
    @IsOptional()
    gender?: UserGender

}

/** 更新密码 请求 DTO */
export class UpdatePasswordRequestDto {

    /** 旧密码 */
    @IsNotEmpty({ message: "旧密码不能为空" })
    @IsString({ message: "旧密码必须是字符串" })
    oldPassword: string

    /** 新密码 */
    @IsPassword("新密码")
    newPassword: string

}

/** 更新头像 请求 DTO */
export class UpdateAvatarRequestDto {

    /** 头像 */
    @MaxLength(100, { message: "头像路径最多100个字符" })
    @IsString({ message: "头像必须是字符串" })
    avatar: string

}
