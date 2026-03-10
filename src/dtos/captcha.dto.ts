/*
 * @FileDesc: 验证码 DTO
 */

import { IsNotEmpty, IsString, MaxLength, Matches } from "class-validator"

/** 验证码 请求 DTO */
export class CaptchaRequestDto {

    /** 验证码 Key */
    @MaxLength(64, { message: "验证码 Key 最多64个字符" })
    @IsNotEmpty({ message: "验证码 Key 不能为空" })
    @IsString({ message: "验证码 Key 必须是字符串" })
    captchaKey: string

    /** 验证码 */
    @Matches(/^[0-9]+$/, { message: "验证码必须是数字" })
    @IsNotEmpty({ message: "验证码不能为空" })
    @IsString({ message: "验证码必须是字符串" })
    captchaCode: string

}
