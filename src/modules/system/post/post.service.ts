/*
 * @FileDesc: 岗位服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"
import { UserPostService } from "../user-post"

import {
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    CreateRequestDto,
    UpdateRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./post.dto"
import { PostRepository } from "./post.repository"

import type { SysPost, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 岗位服务 */
@Injectable()
export class PostService {

    /** 日志记录器 */
    @InjectPinoLogger(PostService.name)
    private readonly logger: PinoLogger

    /** 岗位仓储 */
    @Inject(PostRepository)
    private readonly postRepository: PostRepository

    /** 用户岗位服务 */
    @Inject(UserPostService)
    private readonly userPostService: UserPostService

    /**
     * 获取岗位列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysPost[]>} 岗位列表
     */
    public async getList (params: GetListRequestDto): Promise<SysPost[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.postRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页岗位列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysPost>>} 岗位列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysPost>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.postRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取岗位详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<SysPost>} 岗位详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<SysPost> {

        this.logger.info("[getDetail] started")

        const data = await this.checkPostExists(params.id)

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建岗位
     *
     * @param {CreateRequestDto} params 创建岗位参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        await this.checkNameNotExists(params.name)
        await this.checkCodeNotExists(params.code)

        const createData: Prisma.SysPostCreateArgs["data"] = {
            ...params,
            createdBy: user?.username
        }

        await this.postRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 更新岗位
     *
     * @param {UpdateRequestDto} params 更新岗位参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        const existingPost = await this.checkPostExists(params.id)

        if (params.name !== existingPost.name) {

            await this.checkNameNotExists(params.name)

        }

        if (params.code !== existingPost.code) {

            await this.checkCodeNotExists(params.code)

        }

        const { id, ...updateData } = params

        await this.postRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 删除岗位
     *
     * @param {DeleteRequestDto} params 删除岗位参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        await this.checkPostExists(params.id)

        const hasUsers = await this.userPostService.existsByPostIds([params.id])
        if (hasUsers) {

            throw new BusinessLogicException("岗位下存在用户，不能删除")

        }

        await this.postRepository.deleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除岗位
     *
     * @param {BatchDeleteRequestDto} params 批量删除岗位参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const posts = await this.postRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (posts.length !== params.ids.length) {

            throw new BusinessLogicException("部分岗位不存在")

        }

        const hasUsers = await this.userPostService.existsByPostIds(params.ids)
        if (hasUsers) {

            throw new BusinessLogicException("存在用户绑定的岗位，不能删除")

        }

        await this.postRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 根据ID数组校验岗位是否全部存在
     *
     * @param {number[]} ids 岗位ID数组
     * @returns {Promise<boolean>} 是否全部存在
     */
    public async existsByIds (ids: number[]): Promise<boolean> {

        const count = await this.postRepository.count({ where: { id: { in: ids } } })
        return count === ids.length

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysPostWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysPostWhereInput {

        const { name, code, isActive } = params

        return {
            ...name && { name: { contains: name } },
            ...code && { code: { contains: code } },
            ...isActive !== void 0 && { isActive }
        }

    }

    /**
     * 检查岗位是否存在
     *
     * @param {number} id 岗位ID
     * @returns {Promise<SysPost>} 岗位信息
     * @throws {BusinessLogicException} 岗位不存在时抛出异常
     */
    private async checkPostExists (id: number): Promise<SysPost> {

        const post = await this.postRepository.findById(id)
        if (!post) {

            throw new BusinessLogicException("岗位不存在")

        }
        return post

    }

    /**
     * 检查岗位名称是否不存在
     *
     * @param {string} name 岗位名称
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 岗位名称已存在时抛出异常
     */
    private async checkNameNotExists (name: string): Promise<void> {

        const exists = await this.postRepository.exists({ name })
        if (exists) {

            throw new BusinessLogicException("岗位名称已存在")

        }

    }

    /**
     * 检查岗位代码是否不存在
     *
     * @param {string} code 岗位代码
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 岗位代码已存在时抛出异常
     */
    private async checkCodeNotExists (code: string): Promise<void> {

        const exists = await this.postRepository.exists({ code })
        if (exists) {

            throw new BusinessLogicException("岗位代码已存在")

        }

    }

}
