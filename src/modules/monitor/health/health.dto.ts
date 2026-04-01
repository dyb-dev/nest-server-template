/*
 * @FileDesc: 健康检查 DTO
 */

/** 健康状态 */
export type HealthStatus = "up" | "down"

/** 健康检查响应 DTO */
export class CheckResponseDto {

    /** 数据库状态 */
    database: HealthStatus
    /** 缓存状态 */
    cache: HealthStatus

}
