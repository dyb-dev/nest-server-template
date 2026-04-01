/*
 * @FileDesc: 服务器监控 DTO
 */

/** CPU 基础信息 */
export class CpuDto {

    /** 制造商 */
    manufacturer: string
    /** 品牌 */
    brand: string
    /** 基础频率（GHz） */
    speed: number
    /** 最大频率（GHz） */
    speedMax: number
    /** 物理核心数 */
    physicalCores: number
    /** 逻辑核心数 */
    cores: number

}

/** CPU 实时负载 */
export class CpuLoadDto {

    /** 当前 CPU 总负载（%） */
    currentLoad: number
    /** 用户态负载（%） */
    currentLoadUser: number
    /** 内核态负载（%） */
    currentLoadSystem: number
    /** 空闲（%） */
    currentLoadIdle: number
    /** 每核心负载（%） */
    cpus: number[]

}

/** 内存信息 */
export class MemDto {

    /** 总内存（bytes） */
    total: number
    /** 活跃使用（bytes，不含 buffers/cache） */
    active: number
    /** 内存使用率（%） */
    activeRate: number
    /** 可用（bytes） */
    available: number
    /** swap 总量（bytes） */
    swapTotal: number
    /** swap 已用（bytes） */
    swapUsed: number
    /** swap 空闲（bytes） */
    swapFree: number

}

/** 磁盘信息 */
export class DiskDto {

    /** 文件系统名称 */
    fs: string
    /** 文件系统类型 */
    type: string
    /** 挂载点 */
    mount: string
    /** 总空间（bytes） */
    size: number
    /** 已用（bytes） */
    used: number
    /** 可用（bytes） */
    available: number
    /** 使用率（%） */
    use: number

}

/** 操作系统信息 */
export class OsDto {

    /** 平台 */
    platform: string
    /** 发行版名称 */
    distro: string
    /** 发行版版本 */
    release: string
    /** 内核版本 */
    kernel: string
    /** 架构 */
    arch: string
    /** 主机名 */
    hostname: string

}

/** Node.js 运行时内存信息 */
export class RuntimeMemoryDto {

    /** 进程占用物理内存（bytes） */
    rss: number
    /** V8 堆总量（bytes） */
    heapTotal: number
    /** V8 堆已用（bytes） */
    heapUsed: number
    /** 外部 C++ 对象占用（bytes） */
    external: number

}

/** Node.js 运行时信息 */
export class RuntimeDto {

    /** Node.js 版本 */
    nodeVersion: string
    /** 进程 ID */
    pid: number
    /** 运行环境 */
    env: string
    /** 进程运行时长（秒） */
    uptime: number
    /** 内存使用情况 */
    memory: RuntimeMemoryDto

}

/** 获取服务器信息 响应 DTO */
export class GetInfoResponseDto {

    /** CPU 基础信息 */
    cpu: CpuDto
    /** CPU 实时负载 */
    cpuLoad: CpuLoadDto
    /** 内存信息 */
    mem: MemDto
    /** 磁盘信息列表 */
    diskList: DiskDto[]
    /** 操作系统信息 */
    os: OsDto
    /** Node.js 运行时信息 */
    runtime: RuntimeDto

}
