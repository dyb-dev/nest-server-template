/*
 * @FileDesc: 字典类型服务
 */

import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"
import { DictItemService } from "../dict-item"

import {
    CreateRequestDto,
    UpdateRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./dict-type.dto"
import { DictTypeRepository } from "./dict-type.repository"

import type { SysDictType, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

export type WrapperType<T> = T

/** 字典类型服务 */
@Injectable()
export class DictTypeService {

    /** 日志记录器 */
    @InjectPinoLogger(DictTypeService.name)
    private readonly logger: PinoLogger

    /** 字典类型仓储 */
    @Inject(DictTypeRepository)
    private readonly dictTypeRepository: DictTypeRepository

    /** 字典项服务 */
    @Inject(forwardRef(() => DictItemService))
    private readonly dictItemService: TWrapper<DictItemService>

    /**
     * 获取字典类型列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysDictType[]>} 字典类型列表
     */
    public async getList (params: GetListRequestDto): Promise<SysDictType[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.dictTypeRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页字典类型列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysDictType>>} 字典类型列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysDictType>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.dictTypeRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取字典类型详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<SysDictType>} 字典类型详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<SysDictType> {

        this.logger.info("[getDetail] started")

        const data = await this.checkDictTypeExists(params.id)

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建字典类型
     *
     * @param {CreateRequestDto} params 创建参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        await this.checkNameNotExists(params.name)
        await this.checkCodeNotExists(params.code)

        const createData: Prisma.SysDictTypeCreateArgs["data"] = {
            ...params,
            createdBy: user?.username
        }

        await this.dictTypeRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 更新字典类型
     *
     * @param {UpdateRequestDto} params 更新参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        const existingDictType = await this.checkDictTypeExists(params.id)

        if (params.name !== existingDictType.name) {

            await this.checkNameNotExists(params.name)

        }

        if (params.code !== existingDictType.code) {

            await this.checkCodeNotExists(params.code)

        }

        const { id, ...updateData } = params

        await this.dictTypeRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 删除字典类型
     *
     * @param {DeleteRequestDto} params 删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        await this.checkDictTypeExists(params.id)

        const hasItems = await this.dictItemService.existsByTypeIds([params.id])
        if (hasItems) {

            throw new BusinessLogicException("请先删除该类型下的所有字典项")

        }

        await this.dictTypeRepository.deleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除字典类型
     *
     * @param {BatchDeleteRequestDto} params 批量删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const dictTypes = await this.dictTypeRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (dictTypes.length !== params.ids.length) {

            throw new BusinessLogicException("部分字典类型不存在")

        }

        const hasItems = await this.dictItemService.existsByTypeIds(params.ids)
        if (hasItems) {

            throw new BusinessLogicException("请先删除相关类型下的所有字典项")

        }

        await this.dictTypeRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 检查字典类型是否存在
     *
     * @param {number} id 类型ID
     * @returns {Promise<SysDictType>} 字典类型信息
     * @throws {BusinessLogicException} 字典类型不存在时抛出异常
     */
    public async checkDictTypeExists (id: number): Promise<SysDictType> {

        const dictType = await this.dictTypeRepository.findById(id)
        if (!dictType) {

            throw new BusinessLogicException("字典类型不存在")

        }
        return dictType

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysDictTypeWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysDictTypeWhereInput {

        const { name, code, isActive, createdAtStart, createdAtEnd } = params

        return {
            ...name && { name: { contains: name } },
            ...code && { code: { contains: code } },
            ...isActive !== void 0 && { isActive },
            ...(createdAtStart || createdAtEnd) && {
                createdAt: {
                    ...createdAtStart && { gte: new Date(createdAtStart) },
                    ...createdAtEnd && { lte: new Date(createdAtEnd) }
                }
            }
        }

    }

    /**
     * 检查名称是否不存在
     *
     * @param {string} name 名称
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 名称已存在时抛出异常
     */
    private async checkNameNotExists (name: string): Promise<void> {

        const exists = await this.dictTypeRepository.exists({ name })
        if (exists) {

            throw new BusinessLogicException("字典类型名称已存在")

        }

    }

    /**
     * 检查代码是否不存在
     *
     * @param {string} code 代码
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 代码已存在时抛出异常
     */
    private async checkCodeNotExists (code: string): Promise<void> {

        const exists = await this.dictTypeRepository.exists({ code })
        if (exists) {

            throw new BusinessLogicException("字典类型代码已存在")

        }

    }

}
