/*
 * @FileDesc: Cookies 装饰器
 */

import { createParamDecorator } from "@nestjs/common"

import type { ExecutionContext } from "@nestjs/common"
import type { Request } from "express"

/** Cookies 装饰器 */
export const Cookies = createParamDecorator((key: string, context: ExecutionContext) => {

    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest<Request>()
    return key ? request.cookies[key] : request.cookies

})
