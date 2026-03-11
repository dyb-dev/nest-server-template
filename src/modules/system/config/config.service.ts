/*
 * @FileDesc: 参数配置服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"

import {
    CreateRequestDto,
    UpdateRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./config.dto"
import { ConfigRepository } from "./config.repository"

import type { SysConfig, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 参数配置服务 */
@Injectable()
export class ConfigService {

    /** 日志记录器 */
    @InjectPinoLogger(ConfigService.name)
    private readonly logger: PinoLogger

    /** 参数配置仓储 */
    @Inject(ConfigRepository)
    private readonly configRepository: ConfigRepository

    /**
     * 获取参数配置列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysConfig[]>} 配置列表
     */
    public async getList (params: GetListRequestDto): Promise<SysConfig[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.configRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页参数配置列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysConfig>>} 配置列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysConfig>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.configRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取参数配置详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<SysConfig>} 配置详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<SysConfig> {

        this.logger.info("[getDetail] started")

        const data = await this.checkConfigExists(params.id)

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建参数配置
     *
     * @param {CreateRequestDto} params 创建参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        await this.checkKeyNotExists(params.key)

        const createData: Prisma.SysConfigCreateArgs["data"] = {
            ...params,
            isSystem: false,
            createdBy: user?.username
        }

        await this.configRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 更新参数配置
     *
     * @param {UpdateRequestDto} params 更新参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        const existingConfig = await this.checkConfigExists(params.id)

        if (existingConfig.isSystem) {

            const isNameChanged = params.name !== existingConfig.name
            const isKeyChanged = params.key !== existingConfig.key
            const isRemarkChanged = (params.remark ?? null) !== existingConfig.remark

            if (isNameChanged || isKeyChanged || isRemarkChanged) {

                throw new BusinessLogicException("系统配置只允许修改值")

            }

        }

        if (params.key !== existingConfig.key) {

            await this.checkKeyNotExists(params.key)

        }

        const { id, ...updateData } = params

        await this.configRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 删除参数配置
     *
     * @param {DeleteRequestDto} params 删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        const config = await this.checkConfigExists(params.id)

        if (config.isSystem) {

            throw new BusinessLogicException("系统配置不能删除")

        }

        await this.configRepository.deleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除参数配置
     *
     * @param {BatchDeleteRequestDto} params 批量删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const configs = await this.configRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (configs.length !== params.ids.length) {

            throw new BusinessLogicException("部分配置不存在")

        }

        const hasSystemConfig = configs.some(config => config.isSystem)
        if (hasSystemConfig) {

            throw new BusinessLogicException("不能删除系统配置")

        }

        await this.configRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysConfigWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysConfigWhereInput {

        const { name, key, isSystem, createdAtStart, createdAtEnd } = params

        return {
            ...name && { name: { contains: name } },
            ...key && { key: { contains: key } },
            ...isSystem !== void 0 && { isSystem },
            ...(createdAtStart || createdAtEnd) && {
                createdAt: {
                    ...createdAtStart && { gte: new Date(createdAtStart) },
                    ...createdAtEnd && { lte: new Date(createdAtEnd) }
                }
            }
        }

    }

    /**
     * 检查参数配置是否存在
     *
     * @param {number} id 配置ID
     * @returns {Promise<SysConfig>} 配置信息
     * @throws {BusinessLogicException} 配置不存在时抛出异常
     */
    private async checkConfigExists (id: number): Promise<SysConfig> {

        const config = await this.configRepository.findById(id)
        if (!config) {

            throw new BusinessLogicException("配置不存在")

        }
        return config

    }

    /**
     * 检查键是否不存在
     *
     * @param {string} key 键
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 键已存在时抛出异常
     */
    private async checkKeyNotExists (key: string): Promise<void> {

        const exists = await this.configRepository.exists({ key })
        if (exists) {

            throw new BusinessLogicException("配置键已存在")

        }

    }

}
