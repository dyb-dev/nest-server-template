/*
 * @FileDesc: 验证管道
 */

import { Injectable, ValidationPipe as NestValidationPipe } from "@nestjs/common"

import { ParameterValidationException } from "@/exceptions"

/** 验证管道 */
@Injectable()
export class ValidationPipe extends NestValidationPipe {

    public constructor () {

        super({
            // 是否启用自动转换
            transform: true,
            // 转换选项
            transformOptions: {
                // 是否启用隐式类型转换
                enableImplicitConversion: false,
                // 是否检查循环引用
                enableCircularCheck: true,
                // 是否使用类中定义的默认值
                exposeDefaultValues: true,
                // 是否保留未赋值字段
                exposeUnsetFields: true
            },
            // 是否移除未定义的属性
            whitelist: true,
            // 是否拒绝未定义的属性
            forbidNonWhitelisted: true,
            // 是否验证自定义装饰器
            validateCustomDecorators: true,
            // 是否在遇到第一个错误时停止验证
            stopAtFirstError: true,
            // 自定义错误格式
            exceptionFactory: validationErrors => {

                /** 首个验证错误 */
                const firstValidationError = validationErrors[0]
                /** 首个验证错误消息 */
                const firstValidationErrorMessage = Object.values(firstValidationError.constraints ?? {})[0]
                return new ParameterValidationException(firstValidationErrorMessage)

            }
        })

    }

}
