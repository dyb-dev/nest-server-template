/*
 * @FileDesc: 服务器监控服务
 */

import { Injectable } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"
import si from "systeminformation"

import { CpuDto, CpuLoadDto, DiskDto, GetInfoResponseDto, MemDto, OsDto, RuntimeDto, RuntimeMemoryDto } from "./server.dto"

import type { PinoLogger } from "nestjs-pino"

/** 服务器监控服务 */
@Injectable()
export class ServerService {

    /** 日志记录器 */
    @InjectPinoLogger(ServerService.name)
    private readonly logger: PinoLogger

    /**
     * 获取服务器信息
     *
     * @returns {Promise<GetInfoResponseDto>} 服务器信息
     */
    public async getInfo (): Promise<GetInfoResponseDto> {

        this.logger.info("[getInfo] started")

        const [cpu, cpuLoad, mem, disks, osInfo] = await Promise.all([
            si.cpu(),
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.osInfo()
        ])

        const result: GetInfoResponseDto = {
            cpu: this.buildCpu(cpu),
            cpuLoad: this.buildCpuLoad(cpuLoad),
            mem: this.buildMem(mem),
            diskList: this.buildDiskList(disks),
            os: this.buildOs(osInfo),
            runtime: this.buildRuntime()
        }

        this.logger.info("[getInfo] completed")
        return result

    }

    /**
     * 构建 CPU 基础信息
     *
     * @param {Awaited<ReturnType<typeof si.cpu>>} cpu CPU 原始数据
     * @returns {CpuDto} CPU 基础信息
     */
    private buildCpu (cpu: Awaited<ReturnType<typeof si.cpu>>): CpuDto {

        return {
            manufacturer: cpu.manufacturer,
            brand: cpu.brand,
            speed: cpu.speed,
            speedMax: cpu.speedMax,
            physicalCores: cpu.physicalCores,
            cores: cpu.cores
        }

    }

    /**
     * 构建 CPU 实时负载
     *
     * @param {Awaited<ReturnType<typeof si.currentLoad>>} cpuLoad CPU 负载原始数据
     * @returns {CpuLoadDto} CPU 实时负载
     */
    private buildCpuLoad (cpuLoad: Awaited<ReturnType<typeof si.currentLoad>>): CpuLoadDto {

        return {
            currentLoad: parseFloat(cpuLoad.currentLoad.toFixed(2)),
            currentLoadUser: parseFloat(cpuLoad.currentLoadUser.toFixed(2)),
            currentLoadSystem: parseFloat(cpuLoad.currentLoadSystem.toFixed(2)),
            currentLoadIdle: parseFloat(cpuLoad.currentLoadIdle.toFixed(2)),
            cpus: cpuLoad.cpus.map(core => parseFloat(core.load.toFixed(2)))
        }

    }

    /**
     * 构建内存信息
     *
     * @param {Awaited<ReturnType<typeof si.mem>>} mem 内存原始数据
     * @returns {MemDto} 内存信息
     */
    private buildMem (mem: Awaited<ReturnType<typeof si.mem>>): MemDto {

        return {
            total: mem.total,
            active: mem.active,
            activeRate: mem.total > 0 ? parseFloat((mem.active / mem.total * 100).toFixed(2)) : 0,
            available: mem.available,
            swapTotal: mem.swaptotal,
            swapUsed: Math.round(mem.swapused),
            swapFree: Math.round(mem.swapfree)
        }

    }

    /**
     * 构建磁盘信息列表
     *
     * @param {Awaited<ReturnType<typeof si.fsSize>>} disks 磁盘原始数据
     * @returns {DiskDto[]} 磁盘信息列表
     */
    private buildDiskList (disks: Awaited<ReturnType<typeof si.fsSize>>): DiskDto[] {

        return disks
            .filter(disk => disk.size > 0)
            .map(disk => ({
                fs: disk.fs,
                type: disk.type,
                mount: disk.mount,
                size: disk.size,
                used: disk.used,
                available: disk.available,
                use: parseFloat(disk.use.toFixed(2))
            }))

    }

    /**
     * 构建操作系统信息
     *
     * @param {Awaited<ReturnType<typeof si.osInfo>>} osInfo 操作系统原始数据
     * @returns {OsDto} 操作系统信息
     */
    private buildOs (osInfo: Awaited<ReturnType<typeof si.osInfo>>): OsDto {

        return {
            platform: osInfo.platform,
            distro: osInfo.distro,
            release: osInfo.release,
            kernel: osInfo.kernel,
            arch: osInfo.arch,
            hostname: osInfo.hostname
        }

    }

    /**
     * 构建 Node.js 运行时信息
     *
     * @returns {RuntimeDto} Node.js 运行时信息
     */
    private buildRuntime (): RuntimeDto {

        const memUsage = process.memoryUsage()

        const memory: RuntimeMemoryDto = {
            rss: memUsage.rss,
            heapTotal: memUsage.heapTotal,
            heapUsed: memUsage.heapUsed,
            external: memUsage.external
        }

        return {
            nodeVersion: process.version,
            pid: process.pid,
            env: process.env.NODE_ENV ?? "unknown",
            uptime: Math.floor(process.uptime()),
            memory
        }

    }

}
