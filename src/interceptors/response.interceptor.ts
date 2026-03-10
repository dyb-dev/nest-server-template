/*
 * @FileDesc: 响应拦截器
 */

import { Injectable, StreamableFile } from "@nestjs/common"
import { map } from "rxjs"

import { ResponseDto } from "@/dtos"

import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common"
import type { Request } from "express"
import type { Observable } from "rxjs"

/** 响应拦截器 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {

    public intercept (context: ExecutionContext, next: CallHandler): Observable<StreamableFile | ResponseDto> {

        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<Request>()

        return next.handle().pipe(
            map((data: StreamableFile | unknown) => {

                const { requestId } = request
                return data instanceof StreamableFile ? data : ResponseDto.success({ data, requestId })

            })
        )

    }

}
