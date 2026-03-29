/*
 * @FileDesc: 字典项服务
 */

import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"
import { DictTypeService } from "../dict-type"

import {
    CreateRequestDto,
    UpdateRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./dict-item.dto"
import { DictItemRepository } from "./dict-item.repository"

import type { SysDictItem, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 字典项服务 */
@Injectable()
export class DictItemService {

    /** 日志记录器 */
    @InjectPinoLogger(DictItemService.name)
    private readonly logger: PinoLogger

    /** 字典项仓储 */
    @Inject(DictItemRepository)
    private readonly dictItemRepository: DictItemRepository

    /** 字典类型服务 */
    @Inject(forwardRef(() => DictTypeService))
    private readonly dictTypeService: TWrapper<DictTypeService>

    /**
     * 获取字典项列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysDictItem[]>} 字典项列表
     */
    public async getList (params: GetListRequestDto): Promise<SysDictItem[]> {

        this.logger.info("[getList] started")

        await this.dictTypeService.checkDictTypeExists(params.typeId)

        const where = this.buildQueryWhere(params)
        const data = await this.dictItemRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页字典项列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysDictItem>>} 字典项列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysDictItem>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        await this.dictTypeService.checkDictTypeExists(restParams.typeId)

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.dictItemRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取字典项详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<SysDictItem>} 字典项详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<SysDictItem> {

        this.logger.info("[getDetail] started")

        const data = await this.checkDictItemExists(params.id)

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建字典项
     *
     * @param {CreateRequestDto} params 创建参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        await this.dictTypeService.checkDictTypeExists(params.typeId)
        await this.checkLabelNotExists(params.typeId, params.label)
        await this.checkValueNotExists(params.typeId, params.value)

        const createData: Prisma.SysDictItemCreateArgs["data"] = {
            ...params,
            createdBy: user?.username
        }

        await this.dictItemRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 更新字典项
     *
     * @param {UpdateRequestDto} params 更新参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        const existingItem = await this.checkDictItemExists(params.id)

        if (params.label !== existingItem.label) {

            await this.checkLabelNotExists(existingItem.typeId, params.label)

        }

        if (params.value !== existingItem.value) {

            await this.checkValueNotExists(existingItem.typeId, params.value)

        }

        const { id, ...updateData } = params

        await this.dictItemRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 删除字典项
     *
     * @param {DeleteRequestDto} params 删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        await this.checkDictItemExists(params.id)
        await this.dictItemRepository.deleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除字典项
     *
     * @param {BatchDeleteRequestDto} params 批量删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const dictItems = await this.dictItemRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (dictItems.length !== params.ids.length) {

            throw new BusinessLogicException("部分字典项不存在")

        }

        await this.dictItemRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 检查指定类型下是否存在字典项
     *
     * @param {number[]} typeIds 字典类型ID数组
     * @returns {Promise<boolean>} 是否存在字典项
     */
    public async existsByTypeIds (typeIds: number[]): Promise<boolean> {

        const count = await this.dictItemRepository.count({ where: { typeId: { in: typeIds } } })
        return count > 0

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysDictItemWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysDictItemWhereInput {

        const { typeId, label, isActive } = params

        return {
            typeId,
            ...label && { label: { contains: label } },
            ...isActive !== void 0 && { isActive }
        }

    }

    /**
     * 检查字典项是否存在
     *
     * @param {number} id 字典项ID
     * @returns {Promise<SysDictItem>} 字典项信息
     * @throws {BusinessLogicException} 字典项不存在时抛出异常
     */
    private async checkDictItemExists (id: number): Promise<SysDictItem> {

        const dictItem = await this.dictItemRepository.findById(id)
        if (!dictItem) {

            throw new BusinessLogicException("字典项不存在")

        }
        return dictItem

    }

    /**
     * 检查标签在同类型下是否不存在
     *
     * @param {number} typeId 字典类型ID
     * @param {string} label 标签
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 标签已存在时抛出异常
     */
    private async checkLabelNotExists (typeId: number, label: string): Promise<void> {

        const exists = await this.dictItemRepository.exists({ typeId, label })
        if (exists) {

            throw new BusinessLogicException("字典项标签在该类型下已存在")

        }

    }

    /**
     * 检查值在同类型下是否不存在
     *
     * @param {number} typeId 字典类型ID
     * @param {string} value 值
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 值已存在时抛出异常
     */
    private async checkValueNotExists (typeId: number, value: string): Promise<void> {

        const exists = await this.dictItemRepository.exists({ typeId, value })
        if (exists) {

            throw new BusinessLogicException("字典项值在该类型下已存在")

        }

    }

}
