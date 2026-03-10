/*
 * @FileDesc: 全局异常过滤器
 */

import { Catch, HttpException, Inject } from "@nestjs/common"
import { ThrottlerException } from "@nestjs/throttler"
import { omit } from "es-toolkit"
import { InjectPinoLogger } from "nestjs-pino"

import { RESPONSE_CODE_TO_HTTP_STATUS, RESPONSE_CODE_TO_MESSAGE } from "@/constants"
import { ResponseDto } from "@/dtos"
import {
    AccessTokenException,
    BusinessLogicException,
    CryptoOperationException,
    CsrfTokenException,
    ParameterValidationException,
    RefreshTokenException,
    ReplayRequestException
} from "@/exceptions"
import { OperationLogService } from "@/modules"
import { PrismaClientKnownRequestError } from "@/prisma/internal/prismaNamespace"

import { EResponseCode } from "@/types"

import type { ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common"
import type { Request, Response } from "express"
import type { PinoLogger } from "nestjs-pino"

/** ALL 异常类型 */
type TException =
    | ThrottlerException
    | CsrfTokenException
    | AccessTokenException
    | ReplayRequestException
    | RefreshTokenException
    | CryptoOperationException
    | ParameterValidationException
    | BusinessLogicException
    | PrismaClientKnownRequestError
    | HttpException
    | Error

/** 全局异常过滤器 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    /** 日志记录器 */
    @InjectPinoLogger(GlobalExceptionFilter.name)
    private readonly logger: PinoLogger

    /** 操作日志服务 */
    @Inject(OperationLogService)
    private readonly operationLogService: OperationLogService

    public catch (exception: TException, host: ArgumentsHost): void {

        const httpContext = host.switchToHttp()
        const request = httpContext.getRequest<Request>()
        const response = httpContext.getResponse<Response>()

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

        const { httpStatus, code, message } = this.resolveException(exception)

        const failResponseDto = ResponseDto.fail({
            requestId,
            code,
            message
        })

        const duration = Date.now() - startTime

        this.operationLogService.create({
            requestId,
            userId: user?.id,
            username: user?.username,
            method,
            path,
            params,
            result: failResponseDto as Record<string, any>,
            ip,
            location,
            browser,
            os,
            isSuccess: false,
            message: failResponseDto.message,
            duration
        })

        this.logger.error(
            {
                requestId,
                ...omit(failResponseDto, ["data", "datetime", "requestId"]),
                duration: `${duration}ms`
            },
            "Request failed"
        )

        this.logger.error(`Stack trace\n${exception.stack}`)

        response.status(httpStatus).json(failResponseDto)

    }

    /**
     * 解析异常对象
     *
     * @param exception 异常对象
     * @returns 规范化的 HTTP 状态码、业务码和消息
     */
    private resolveException (exception: TException): { httpStatus: HttpStatus; code: ResponseDto["code"]; message: string } {

        // 请求限流
        if (exception instanceof ThrottlerException) {

            return {
                httpStatus: RESPONSE_CODE_TO_HTTP_STATUS[EResponseCode.RateLimitExceeded],
                code: EResponseCode.RateLimitExceeded,
                message: RESPONSE_CODE_TO_MESSAGE[EResponseCode.RateLimitExceeded]
            }

        }

        // CSRF 令牌无效 | 访问令牌无效 | 重放请求已拒绝 | 刷新令牌无效 | 加解密操作错误 | 参数验证错误 | 业务逻辑错误
        if (
            exception instanceof CsrfTokenException ||
            exception instanceof AccessTokenException ||
            exception instanceof ReplayRequestException ||
            exception instanceof RefreshTokenException ||
            exception instanceof CryptoOperationException ||
            exception instanceof ParameterValidationException ||
            exception instanceof BusinessLogicException
        ) {

            const status = exception.getStatus() as EResponseCode
            return {
                httpStatus: RESPONSE_CODE_TO_HTTP_STATUS[status],
                code: status,
                message: exception.getResponse() as string
            }

        }

        // Prisma 客户端错误
        if (exception instanceof PrismaClientKnownRequestError) {

            return {
                httpStatus: RESPONSE_CODE_TO_HTTP_STATUS[EResponseCode.DataAccessError],
                code: EResponseCode.DataAccessError,
                message: RESPONSE_CODE_TO_MESSAGE[EResponseCode.DataAccessError]
            }

        }

        // HTTP 异常
        if (exception instanceof HttpException) {

            const status = exception.getStatus()
            const response = exception.getResponse()
            const message = typeof response === "string" ? response : (response as { message: string }).message || "unknown error"

            return {
                httpStatus: status,
                code: status,
                message
            }

        }

        return {
            httpStatus: RESPONSE_CODE_TO_HTTP_STATUS[EResponseCode.InternalServerError],
            code: EResponseCode.InternalServerError,
            message: RESPONSE_CODE_TO_MESSAGE[EResponseCode.InternalServerError]
        }

    }

}
