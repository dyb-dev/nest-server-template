/*
 * @FileDesc: 用户装饰器
 */

import { createParamDecorator } from "@nestjs/common"

import type { ExecutionContext } from "@nestjs/common"
import type { Request } from "express"

/** 用户装饰器 */
export const User = createParamDecorator((key: keyof Request["user"], context: ExecutionContext) => {

    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest<Request>()
    return key ? request.user?.[key] : request.user

})
