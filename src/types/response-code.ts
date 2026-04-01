/*
 * @FileDesc: 响应码类型
 */

/** 响应码 */
export const enum EResponseCode {
    /** 成功 */
    Success = 0,

    /** CSRF 令牌无效 */
    CsrfTokenInvalid = 1001,
    /** 请求限流 */
    RateLimitExceeded = 1002,
    /** 重放请求已拒绝 */
    ReplayRequestRejected = 1003,

    /** 访问令牌无效 */
    AccessTokenInvalid = 2001,
    /** 刷新令牌无效 */
    RefreshTokenInvalid = 2002,
    /** 权限不足 */
    InsufficientPermissions = 2003,

    /** 参数验证错误 */
    ParameterValidationError = 4001,
    /** 业务逻辑错误 */
    BusinessLogicError = 4002,
    /** 加解密操作错误 */
    CryptoOperationError = 4003,

    /** 服务器内部错误 */
    InternalServerError = 5000,
    /** 数据访问错误 */
    DataAccessError = 5001,
    /** 健康检查失败 */
    HealthCheckFailed = 5002
}
