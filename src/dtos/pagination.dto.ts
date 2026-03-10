/*
 * @FileDesc: 分页 DTO
 */

import { Type } from "class-transformer"
import { IsInt, Min, Max } from "class-validator"

/** 分页 请求 DTO */
export class PaginationRequestDto {

    /** 页码 */
    @Min(1, { message: "页码至少为1" })
    @IsInt({ message: "页码必须是整数" })
    @Type(() => Number)
    page: number

    /** 每页数量 */
    @Max(100, { message: "每页数量最多为100" })
    @Min(1, { message: "每页数量至少为1" })
    @IsInt({ message: "每页数量必须是整数" })
    @Type(() => Number)
    pageSize: number

}

/** 分页 响应 DTO */
export class PaginationResponseDto<T> {

    /** 列表数据 */
    list: T[]
    /** 总数 */
    total: number

}
