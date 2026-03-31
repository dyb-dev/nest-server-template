/*
 * @FileDesc: 缓存监控控制器
 */

import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission } from "@/decorators"

import {
    DeleteByKeyRequestDto,
    DeleteByNameRequestDto,
    GetInfoResponseDto,
    GetKeyListRequestDto,
    GetValueRequestDto
} from "./cache.dto"
import { CacheService } from "./cache.service"

import type { PinoLogger } from "nestjs-pino"

/** 缓存监控控制器 */
@Controller("cache")
export class CacheController {

    /** 日志记录器 */
    @InjectPinoLogger(CacheController.name)
    private readonly logger: PinoLogger

    /** 缓存监控服务 */
    @Inject(CacheService)
    private readonly cacheService: CacheService

    /**
     * 获取缓存信息
     *
     * @returns {Promise<GetInfoResponseDto>} 缓存信息
     */
    @Permission("system:cache:read")
    @Get("getInfo")
    public async getInfo (): Promise<GetInfoResponseDto> {

        this.logger.info("[getInfo] started")
        const data = await this.cacheService.getInfo()
        this.logger.info("[getInfo] completed")
        return data

    }

    /**
     * 获取缓存名称列表
     *
     * @returns {Promise<string[]>} 缓存名称列表
     */
    @Permission("system:cache:read")
    @Get("getNameList")
    public async getNameList (): Promise<string[]> {

        this.logger.info("[getNameList] started")
        const data = await this.cacheService.getNameList()
        this.logger.info("[getNameList] completed")
        return data

    }

    /**
     * 获取缓存键名列表
     *
     * @param {GetKeyListRequestDto} query 请求参数
     * @returns {Promise<string[]>} 缓存键名列表
     */
    @Permission("system:cache:read")
    @Get("getKeyList")
    public async getKeyList (@Query() query: GetKeyListRequestDto): Promise<string[]> {

        this.logger.info("[getKeyList] started")
        const data = await this.cacheService.getKeyList(query)
        this.logger.info("[getKeyList] completed")
        return data

    }

    /**
     * 获取缓存键值
     *
     * @param {GetValueRequestDto} query 请求参数
     * @returns {Promise<unknown>} 缓存键值
     */
    @Permission("system:cache:read")
    @Get("getValue")
    public async getValue (@Query() query: GetValueRequestDto): Promise<unknown> {

        this.logger.info("[getValue] started")
        const data = await this.cacheService.getValue(query)
        this.logger.info("[getValue] completed")
        return data

    }

    /**
     * 删除缓存名称
     *
     * @param {DeleteByNameRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:cache:delete")
    @Post("deleteByName")
    public async deleteByName (@Body() body: DeleteByNameRequestDto): Promise<void> {

        this.logger.info("[deleteByName] started")
        await this.cacheService.deleteByName(body)
        this.logger.info("[deleteByName] completed")

    }

    /**
     * 删除缓存键
     *
     * @param {DeleteByKeyRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:cache:delete")
    @Post("deleteByKey")
    public async deleteByKey (@Body() body: DeleteByKeyRequestDto): Promise<void> {

        this.logger.info("[deleteByKey] started")
        await this.cacheService.deleteByKey(body)
        this.logger.info("[deleteByKey] completed")

    }

    /**
     * 清空所有缓存
     *
     * @returns {Promise<void>}
     */
    @Permission("system:cache:delete")
    @Post("deleteAll")
    public async deleteAll (): Promise<void> {

        this.logger.info("[deleteAll] started")
        await this.cacheService.deleteAll()
        this.logger.info("[deleteAll] completed")

    }

}
