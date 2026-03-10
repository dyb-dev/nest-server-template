/*
 * @FileDesc: 日志拦截器
 */

import { Inject, Injectable, StreamableFile } from "@nestjs/common"
import { omit } from "es-toolkit"
import { InjectPinoLogger } from "nestjs-pino"
import { tap } from "rxjs"

import { ResponseDto } from "@/dtos"
import { OperationLogService } from "@/modules"

import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"
import type { Observable } from "rxjs"

/** 日志拦截器 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {

    /** 日志记录器 */
    @InjectPinoLogger(LoggerInterceptor.name)
    private readonly logger: PinoLogger

    /** 操作日志服务 */
    @Inject(OperationLogService)
    private readonly operationLogService: OperationLogService

    public intercept (context: ExecutionContext, next: CallHandler): Observable<StreamableFile | ResponseDto> {

        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<Request>()

        return next.handle().pipe(
            tap((data: StreamableFile | ResponseDto) => {

                const {
                    requestId,
                    startTime,
                    user,
                    method,
                    requestPath: path,
                    requestParams: params,
                    clientIp: ip,
                    location,
                    browser,
                    os
                } = request

                const result = data instanceof StreamableFile ? {} : data

                const duration = Date.now() - startTime

                this.operationLogService.create({
                    requestId,
                    userId: user?.id,
                    username: user?.username,
                    method,
                    path,
                    params,
                    result,
                    ip,
                    location,
                    browser,
                    os,
                    isSuccess: true,
                    message: "操作成功",
                    duration
                })

                this.logger.info(
                    {
                        requestId,
                        ...omit(result, ["data", "datetime", "requestId"]),
                        duration: `${duration}ms`
                    },
                    "Request completed"
                )

            })
        )

    }

}
