/*
 * @FileDesc: Demo DTO
 */

import { Transform } from "class-transformer"
import { IsNotEmpty, IsArray } from "class-validator"

/** 获取演示列表 请求 DTO */
export class GetDemoListRequestDto {

    /** 演示列表 */
    @IsArray({ message: "demoList必须是数组" })
    @Transform(({ value }) => {

        if (typeof value === "string") {

            try {

                const parsed = JSON.parse(value)
                return parsed

            }
            catch {

                return value

            }

        }

        return value

    })
    @IsNotEmpty({ message: "demoList不能为空" })
    demoList: string[]

}

/** 获取帖子 响应 DTO */
export class GetPostsResponseDto {

    /** 主体 */
    body: string
    /** id */
    id: number
    /** 标题 */
    title: string
    /** 用户 id */
    userId: number

}
