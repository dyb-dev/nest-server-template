/*
 * @FileDesc: 用户名装饰器
 */

import { applyDecorators } from "@nestjs/common"
import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator"

/**
 * 用户名装饰器
 *
 * @returns {ReturnType<typeof applyDecorators>} 属性装饰器
 */
export const IsUsername = (): ReturnType<typeof applyDecorators> => {

    return applyDecorators(
        Matches(/^[a-zA-Z0-9._-]+$/, { message: "用户名仅允许英文字母、数字和特殊符号 . _ -" }),
        MaxLength(20, { message: "用户名最多20个字符" }),
        MinLength(4, { message: "用户名至少4个字符" }),
        IsNotEmpty({ message: "用户名不能为空" }),
        IsString({ message: "用户名必须是字符串" })
    )

}
