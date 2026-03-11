/*
 * @FileDesc: 用户服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { hash, compare } from "bcrypt"
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
    UpdatePasswordRequestDto,
    UpdateStatusRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto,
    UpdateAvatarRequestDto
} from "./user.dto"
import { UserRepository } from "./user.repository"

import type { SysUser, Prisma, SysDept } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 用户服务 */
@Injectable()
export class UserService {

    /** 日志记录器 */
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger

    /** 用户仓储 */
    @Inject(UserRepository)
    private readonly userRepository: UserRepository

    /**
     * 获取用户列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">[]>} 用户列表
     */
    public async getList (params: GetListRequestDto): Promise<Omit<SysUser, "password" | "deletedAt">[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.userRepository.findMany({
            where,
            include: {
                dept: true
            }
        })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页用户列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>>} 用户列表和总数
     */
    public async getPageList (
        params: GetPageListRequestDto
    ): Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.userRepository.findManyByPage(skip, take, {
            where,
            include: {
                dept: true
            }
        })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取用户详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">>} 用户详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<Omit<SysUser, "password" | "deletedAt">> {

        this.logger.info("[getDetail] started")

        const data = await this.userRepository.findById(params.id, {
            include: {
                dept: true,
                userRoles: {
                    include: { role: true }
                },
                userPosts: {
                    include: { post: true }
                }
            }
        })

        if (!data) {

            throw new BusinessLogicException("用户不存在")

        }

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建用户
     *
     * @param {CreateRequestDto} params 创建用户参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        await this.checkUsernameNotExists(params.username)

        if (params.email) {

            await this.checkEmailNotExists(params.email)

        }

        if (params.phone) {

            await this.checkPhoneNotExists(params.phone)

        }

        const hashedPassword = await this.hashPassword(params.password)

        const createData: Prisma.SysUserCreateArgs["data"] = {
            ...params,
            password: hashedPassword,
            createdBy: user?.username
        }

        await this.userRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 更新用户
     *
     * @param {UpdateRequestDto} params 更新用户参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        const existingUser = await this.checkUserExists(params.id)

        if (params.email && params.email !== existingUser.email) {

            await this.checkEmailNotExists(params.email)

        }

        if (params.phone && params.phone !== existingUser.phone) {

            await this.checkPhoneNotExists(params.phone)

        }

        const { id, ...updateData } = params

        await this.userRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 更新用户密码
     *
     * @param {UpdatePasswordRequestDto} params 更新密码参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updatePassword (params: UpdatePasswordRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updatePassword] started")

        if (params.oldPassword === params.newPassword) {

            throw new BusinessLogicException("新密码不能与旧密码相同")

        }

        const existingUser = await this.checkUserExists(params.id)

        const isPasswordValid = await this.validatePassword(params.oldPassword, existingUser.password)
        if (!isPasswordValid) {

            throw new BusinessLogicException("旧密码不正确")

        }

        const hashedPassword = await this.hashPassword(params.newPassword)

        await this.userRepository.updateById(params.id, {
            password: hashedPassword,
            passwordUpdatedAt: new Date(),
            updatedBy: user?.username
        })

        this.logger.info("[updatePassword] completed")

    }

    /**
     * 更新用户状态
     *
     * @param {UpdateStatusRequestDto} params 更新状态参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updateStatus (params: UpdateStatusRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updateStatus] started")

        const existingUser = await this.checkUserExists(params.id)

        if (existingUser.isSystem) {

            throw new BusinessLogicException("系统用户状态不能修改")

        }

        await this.userRepository.updateById(params.id, {
            isActive: params.isActive,
            updatedBy: user?.username
        })

        this.logger.info("[updateStatus] completed")

    }

    /**
     * 更新用户头像
     *
     * @param {UpdateAvatarRequestDto} params 更新头像参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updateAvatar (params: UpdateAvatarRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updateAvatar] started")

        await this.checkUserExists(params.id)

        await this.userRepository.updateById(params.id, {
            avatar: params.avatar,
            updatedBy: user?.username
        })

        this.logger.info("[updateAvatar] completed")

    }

    /**
     * 删除用户
     *
     * @param {DeleteRequestDto} params 删除用户参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        const user = await this.checkUserExists(params.id)

        if (user.isSystem) {

            throw new BusinessLogicException("系统用户不能删除")

        }

        // TODO: SysUserRole、SysUserPost、SysLoginSession 软删除时一并删除
        // SysLoginLog、SysOperationLog 保留
        // SysDept.leaderId 置空

        await this.userRepository.softDeleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除用户
     *
     * @param {BatchDeleteRequestDto} params 批量删除用户参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const users = await this.userRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (users.length !== params.ids.length) {

            throw new BusinessLogicException("部分用户不存在")

        }

        const hasSystemUser = users.some(user => user.isSystem)
        if (hasSystemUser) {

            throw new BusinessLogicException("不能删除系统用户")

        }

        // TODO: SysUserRole、SysUserPost、SysLoginSession 软删除时一并删除
        // SysLoginLog、SysOperationLog 保留
        // SysDept.leaderId 置空

        await this.userRepository.softDeleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 根据用户名获取用户信息
     *
     * @param {string} username 用户名
     * @returns {Promise<(Omit<SysUser, "deletedAt"> & { dept: SysDept | null }) | null>} 用户信息
     */
    public async findByUsername (username: string): Promise<(Omit<SysUser, "deletedAt"> & { dept: SysDept | null }) | null> {

        this.logger.info("[findByUsername] started")

        const data = (await this.userRepository.findFirst({
            where: { username },
            omit: { password: false },
            include: { dept: true }
        })) as (Omit<SysUser, "deletedAt"> & { dept: SysDept | null }) | null

        this.logger.info("[findByUsername] completed")
        return data

    }

    /**
     * 验证用户密码
     *
     * @param {string} plainPassword 明文密码
     * @param {string} hashedPassword 加密密码
     * @returns {Promise<boolean>} 是否匹配
     */
    public validatePassword (plainPassword: string, hashedPassword: string): Promise<boolean> {

        return compare(plainPassword, hashedPassword)

    }

    /**
     * 哈希密码
     *
     * @param {string} password 原始密码
     * @returns {Promise<string>} 哈希后的密码
     */
    private hashPassword (password: string): Promise<string> {

        return hash(password, 10)

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Omit<Prisma.SysUserWhereInput, "deletedAt">} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Omit<Prisma.SysUserWhereInput, "deletedAt"> {

        const { username, email, phone, isActive, createdAtStart, createdAtEnd } = params

        return {
            ...username && { username: { contains: username } },
            ...email && { email: { contains: email } },
            ...phone && { phone: { contains: phone } },
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
     * 检查用户是否存在
     *
     * @param {number} id 用户ID
     * @returns {Promise<Omit<SysUser, "deletedAt">>} 用户信息
     * @throws {BusinessLogicException} 用户不存在时抛出异常
     */
    private async checkUserExists (id: number): Promise<Omit<SysUser, "deletedAt">> {

        const user = await this.userRepository.findById(id, { omit: { password: false } })
        if (!user) {

            throw new BusinessLogicException("用户不存在")

        }
        return user

    }

    /**
     * 检查用户名是否不存在
     *
     * @param {string} username 用户名
     * @returns {Promise<void>}
     */
    private async checkUsernameNotExists (username: string): Promise<void> {

        const exists = await this.userRepository.exists({ username })
        if (exists) {

            throw new BusinessLogicException("用户名已存在")

        }

    }

    /**
     * 检查邮箱是否不存在
     *
     * @param {string} email 邮箱
     * @returns {Promise<void>}
     */
    private async checkEmailNotExists (email: string): Promise<void> {

        const exists = await this.userRepository.exists({ email })
        if (exists) {

            throw new BusinessLogicException("邮箱已存在")

        }

    }

    /**
     * 检查手机号是否不存在
     *
     * @param {string} phone 手机号
     * @returns {Promise<void>}
     */
    private async checkPhoneNotExists (phone: string): Promise<void> {

        const exists = await this.userRepository.exists({ phone })
        if (exists) {

            throw new BusinessLogicException("手机号已存在")

        }

    }

}
