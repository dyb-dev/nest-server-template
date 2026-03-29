/*
 * @FileDesc: 认证 DTO
 */

import { IsNotEmpty, IsString } from "class-validator"

import { IsPassword, IsUsername } from "@/decorators"
import { CaptchaRequestDto } from "@/dtos"

/** 注册 请求 DTO */
export class RegisterRequestDto extends CaptchaRequestDto {

    /** 用户名 */
    @IsUsername()
    username: string

    /** 密码 */
    @IsPassword()
    password: string

}

/** 登录 请求 DTO */
export class LoginRequestDto extends CaptchaRequestDto {

    /** 用户名 */
    @IsNotEmpty({ message: "用户名不能为空" })
    @IsString({ message: "用户名必须是字符串" })
    username: string

    /** 密码 */
    @IsNotEmpty({ message: "密码不能为空" })
    @IsString({ message: "密码必须是字符串" })
    password: string

}
