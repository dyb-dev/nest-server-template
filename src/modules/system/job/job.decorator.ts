/*
 * @FileDesc: 定时任务装饰器
 */

import { registerDecorator } from "class-validator"
import { validateCronExpression } from "cron"

import type { ValidationOptions } from "class-validator"

/**
 * Cron 表达式装饰器
 *
 * @param {ValidationOptions} validationOptions 校验选项
 * @returns {PropertyDecorator} 属性装饰器
 */
export const IsCronExpression = (validationOptions?: ValidationOptions): PropertyDecorator => {

    return (target, propertyName) => {

        registerDecorator({
            name: "isCronExpression",
            target: target.constructor,
            propertyName: propertyName as string,
            options: validationOptions,
            validator: {
                validate: (value: string): boolean => validateCronExpression(value).valid,
                defaultMessage: (): string => "Cron 表达式格式不正确"
            }
        })

    }

}
