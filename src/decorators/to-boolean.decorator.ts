/*
 * @FileDesc: ToBoolean 装饰器
 */

import { Transform } from "class-transformer"

/**
 * ToBoolean 装饰器
 *
 * @returns {PropertyDecorator} 可用于类属性上的装饰器
 */
export const ToBoolean = (): PropertyDecorator => {

    return Transform(({ value }) => {

        if (value === "true") {

            return true

        }
        if (value === "false") {

            return false

        }
        return value

    })

}
