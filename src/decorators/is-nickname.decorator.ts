/*
 * @FileDesc: 昵称装饰器
 */

import { applyDecorators } from "@nestjs/common"
import { IsString, MaxLength, Matches } from "class-validator"

/**
 * 昵称装饰器
 *
 * @returns {ReturnType<typeof applyDecorators>} 属性装饰器
 */
export const IsNickname = (): ReturnType<typeof applyDecorators> => {

    return applyDecorators(
        Matches(/^[\u4e00-\u9fa5a-zA-Z0-9._\-\s]+$/, { message: "昵称支持中文、英文、数字和常见符号 . _ - 空格" }),
        MaxLength(20, { message: "昵称最多20个字符" }),
        IsString({ message: "昵称必须是字符串" })
    )

}
