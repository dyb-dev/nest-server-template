/*
 * @FileDesc: 用户装饰器
 */

import { applyDecorators } from "@nestjs/common"
import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator"

/**
 * 密码装饰器
 *
 * @param {string} label 标签
 * @returns {ReturnType<typeof applyDecorators>} 属性装饰器
 */
export const IsPassword = (label: string = "密码"): ReturnType<typeof applyDecorators> => {

    return applyDecorators(
        Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+[\]{}.,?]+$/, {
            message: `${label}必须包含英文字母和数字,可包含特殊符号 !@#$%^&*()-_=+[]{}.,?`
        }),
        MaxLength(16, { message: `${label}最多16个字符` }),
        MinLength(8, { message: `${label}至少8个字符` }),
        IsNotEmpty({ message: `${label}不能为空` }),
        IsString({ message: `${label}必须是字符串` })
    )

}
