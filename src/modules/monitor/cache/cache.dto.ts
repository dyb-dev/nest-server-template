/*
 * @FileDesc: 缓存监控 DTO
 */

import { IsNotEmpty, IsString } from "class-validator"

/** 获取缓存信息 响应 DTO */
export class GetInfoResponseDto {

    /** Redis 版本 */
    version: string

    /** 运行时长（秒） */
    uptimeInSeconds: number

    /** 运行时长（天） */
    uptimeInDays: number

    /** 已连接客户端数 */
    connectedClients: number

    /** 内存使用量（bytes） */
    usedMemory: number

    /** 内存使用峰值（bytes） */
    usedMemoryPeak: number

    /** 系统总内存（bytes） */
    totalSystemMemory: number

    /** Redis 内存占系统内存比率（%） */
    usedMemoryRate: number

    /** 内存碎片率 */
    memFragmentationRatio: number

    /** 总命令执行次数 */
    totalCommandsProcessed: number

    /** 总连接次数 */
    totalConnectionsReceived: number

    /** 已过期键总数 */
    expiredKeys: number

    /** 缓存命中次数 */
    keyspaceHits: number

    /** 缓存未命中次数 */
    keyspaceMisses: number

    /** 缓存命中率（%） */
    hitRate: number

    /** 键总数 */
    totalKeys: number

}

/** 获取缓存键名列表 请求 DTO */
export class GetKeyListRequestDto {

    /** 缓存名称（前缀） */
    @IsNotEmpty({ message: "缓存名称不能为空" })
    @IsString({ message: "缓存名称必须是字符串" })
    name: string

}

/** 获取缓存键值 请求 DTO */
export class GetValueRequestDto {

    /** 缓存键名 */
    @IsNotEmpty({ message: "缓存键名不能为空" })
    @IsString({ message: "缓存键名必须是字符串" })
    key: string

}

/** 删除缓存名称 请求 DTO */
export class DeleteByNameRequestDto {

    /** 缓存名称（前缀） */
    @IsNotEmpty({ message: "缓存名称不能为空" })
    @IsString({ message: "缓存名称必须是字符串" })
    name: string

}

/** 删除缓存键 请求 DTO */
export class DeleteByKeyRequestDto {

    /** 缓存键名 */
    @IsNotEmpty({ message: "缓存键名不能为空" })
    @IsString({ message: "缓存键名必须是字符串" })
    key: string

}
