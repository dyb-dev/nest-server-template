/*
 * @FileDesc: 响应码常量
 */

import { HttpStatus } from "@nestjs/common"

import { EResponseCode } from "@/types"

/** 响应码 -> 消息 */
export const RESPONSE_CODE_TO_MESSAGE: Record<EResponseCode, string> = {
    [EResponseCode.Success]: "success",

    [EResponseCode.CsrfTokenInvalid]: "csrf token invalid",
    [EResponseCode.RateLimitExceeded]: "rate limit exceeded",
    [EResponseCode.ReplayRequestRejected]: "replay request rejected",

    [EResponseCode.AccessTokenInvalid]: "access token invalid",
    [EResponseCode.RefreshTokenInvalid]: "refresh token invalid",
    [EResponseCode.InsufficientPermissions]: "insufficient permissions",

    [EResponseCode.ParameterValidationError]: "parameter validation error",
    [EResponseCode.BusinessLogicError]: "business logic error",
    [EResponseCode.CryptoOperationError]: "crypto operation error",

    [EResponseCode.InternalServerError]: "internal server error",
    [EResponseCode.DataAccessError]: "data access error"
}

/** 响应码 -> HTTP 状态码 */
export const RESPONSE_CODE_TO_HTTP_STATUS: Record<EResponseCode, HttpStatus> = {
    [EResponseCode.Success]: HttpStatus.OK,

    [EResponseCode.CsrfTokenInvalid]: HttpStatus.FORBIDDEN,
    [EResponseCode.RateLimitExceeded]: HttpStatus.TOO_MANY_REQUESTS,
    [EResponseCode.ReplayRequestRejected]: HttpStatus.FORBIDDEN,

    [EResponseCode.AccessTokenInvalid]: HttpStatus.UNAUTHORIZED,
    [EResponseCode.RefreshTokenInvalid]: HttpStatus.UNAUTHORIZED,
    [EResponseCode.InsufficientPermissions]: HttpStatus.FORBIDDEN,

    [EResponseCode.ParameterValidationError]: HttpStatus.BAD_REQUEST,
    [EResponseCode.BusinessLogicError]: HttpStatus.UNPROCESSABLE_ENTITY,
    [EResponseCode.CryptoOperationError]: HttpStatus.BAD_REQUEST,

    [EResponseCode.InternalServerError]: HttpStatus.INTERNAL_SERVER_ERROR,
    [EResponseCode.DataAccessError]: HttpStatus.INTERNAL_SERVER_ERROR
}
