/*
 * @FileDesc: 个人主页 DTO
 */

import { IsString, IsNotEmpty, MaxLength } from "class-validator"

import { IsPassword } from "@/decorators"

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
