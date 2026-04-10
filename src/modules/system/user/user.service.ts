/*
 * @FileDesc: 用户服务
 */

import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { hash, compare } from "bcrypt"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"
import { LoginSessionService } from "../../monitor"
import { ConfigService } from "../config"
import { DeptService } from "../dept"
import { PostService } from "../post"
import { RoleService } from "../role"
import { RoleDeptService } from "../role-dept"
import { UserPostService } from "../user-post"
import { UserRoleService } from "../user-role"

import {
    CreateRequestDto,
    UpdateRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    ResetPasswordRequestDto,
    UpdateStatusRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto
} from "./user.dto"
import { UserRepository } from "./user.repository"

import type { SysUser, Prisma, SysDept, UserGender } from "@/prisma/client"
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

    /** 登录会话服务 */
    @Inject(forwardRef(() => LoginSessionService))
    private readonly loginSessionService: TWrapper<LoginSessionService>

    /** 部门服务 */
    @Inject(forwardRef(() => DeptService))
    private readonly deptService: TWrapper<DeptService>

    /** 岗位服务 */
    @Inject(PostService)
    private readonly postService: PostService

    /** 用户岗位服务 */
    @Inject(UserPostService)
    private readonly userPostService: UserPostService

    /** 角色服务 */
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: TWrapper<RoleService>

    /** 用户角色服务 */
    @Inject(UserRoleService)
    private readonly userRoleService: UserRoleService

    /** 角色部门服务 */
    @Inject(RoleDeptService)
    private readonly roleDeptService: RoleDeptService

    /** 参数配置服务 */
    @Inject(ConfigService)
    private readonly configService: ConfigService

    /**
     * 获取用户列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">[]>} 用户列表
     */
    public async getList (params: GetListRequestDto, user: Request["user"]): Promise<Omit<SysUser, "password" | "deletedAt">[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)

        let allowedDeptIds = await this.resolveDeptIdsByDataScope(user?.id)

        if (params.deptId) {

            const filterDeptIds = await this.deptService.findDeptAndBelowIds(params.deptId)
            allowedDeptIds = allowedDeptIds ? allowedDeptIds.filter(id => filterDeptIds.includes(id)) : filterDeptIds

        }

        const data = await this.userRepository.findMany({
            where: {
                ...where,
                ...allowedDeptIds && { deptId: { in: allowedDeptIds } }
            },
            include: {
                dept: {
                    select: { id: true, name: true }
                }
            }
        })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页用户列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>>} 用户列表和总数
     */
    public async getPageList (
        params: GetPageListRequestDto,
        user: Request["user"]
    ): Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params
        const skip = (page - 1) * pageSize
        const take = pageSize

        const where = this.buildQueryWhere(restParams)

        let allowedDeptIds = await this.resolveDeptIdsByDataScope(user?.id)

        if (params.deptId) {

            const filterDeptIds = await this.deptService.findDeptAndBelowIds(params.deptId)
            allowedDeptIds = allowedDeptIds ? allowedDeptIds.filter(id => filterDeptIds.includes(id)) : filterDeptIds

        }

        const data = await this.userRepository.findManyByPage(skip, take, {
            where: {
                ...where,
                ...allowedDeptIds && { deptId: { in: allowedDeptIds } }
            },
            include: {
                dept: {
                    select: { id: true, name: true }
                }
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
        const data = await this.findById(params.id)
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

        if (params.deptId) {

            await this.checkActiveDeptExists(params.deptId)

        }

        let rawPassword = params.password
        if (!rawPassword) {

            const config = await this.configService.findByKey("sys.user.initPassword")
            if (!config) {

                throw new BusinessLogicException("用户初始密码未配置")

            }
            rawPassword = config.value

        }
        const hashedPassword = await this.hashPassword(rawPassword)

        const { postIds, roleIds, ...restParams } = params

        const createData: Prisma.SysUserCreateArgs["data"] = {
            ...restParams,
            password: hashedPassword,
            createdBy: user?.username
        }

        const createdUser = await this.userRepository.create(createData)

        await this.checkAndSetPostsByUserId(createdUser.id, postIds)
        await this.checkAndSetRolesByUserId(createdUser.id, roleIds)

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

        if (existingUser.isSystem) {

            if (params.isActive !== void 0 && params.isActive !== existingUser.isActive) {

                throw new BusinessLogicException("系统用户状态不允许修改")

            }

            if (params.roleIds) {

                const existingRoleIds = await this.userRoleService.findRoleIdsByUserId(params.id)
                const sortedExisting = existingRoleIds.sort()
                const sortedParams = params.roleIds.sort()
                const isSame =
                    sortedParams.length === sortedExisting.length && sortedParams.every((id, i) => id === sortedExisting[i])
                if (!isSame) {

                    throw new BusinessLogicException("系统用户角色不允许修改")

                }

            }

        }

        if (!params.isActive && params.id === user?.id) {

            throw new BusinessLogicException("不能禁用当前登录账号")

        }

        if (params.email && params.email !== existingUser.email) {

            await this.checkEmailNotExists(params.email)

        }

        if (params.phone && params.phone !== existingUser.phone) {

            await this.checkPhoneNotExists(params.phone)

        }

        if (params.deptId && params.deptId !== existingUser.deptId) {

            await this.checkActiveDeptExists(params.deptId)

        }

        const { id, postIds, roleIds, ...restUpdateData } = params

        await this.checkAndSetPostsByUserId(id, postIds)
        await this.checkAndSetRolesByUserId(id, roleIds)

        await this.userRepository.updateById(id, {
            ...restUpdateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 重置用户密码
     *
     * @param {ResetPasswordRequestDto} params 重置密码参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async resetPassword (params: ResetPasswordRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[resetPassword] started")

        const existingUser = await this.checkUserExists(params.id)

        if (existingUser.isSystem) {

            throw new BusinessLogicException("系统用户密码不允许重置")

        }

        const hashedPassword = await this.hashPassword(params.password)

        await this.userRepository.updateById(params.id, {
            password: hashedPassword,
            passwordUpdatedAt: new Date(),
            updatedBy: user?.username
        })

        this.logger.info("[resetPassword] completed")

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

        if (!params.isActive && params.id === user?.id) {

            throw new BusinessLogicException("不能禁用当前登录账号")

        }

        await this.userRepository.updateById(params.id, {
            isActive: params.isActive,
            updatedBy: user?.username
        })

        this.logger.info("[updateStatus] completed")

    }

    /**
     * 删除用户
     *
     * @param {DeleteRequestDto} params 删除用户参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[delete] started")

        const existingUser = await this.checkUserExists(params.id)

        if (existingUser.isSystem) {

            throw new BusinessLogicException("系统用户不能删除")

        }

        if (params.id === user?.id) {

            throw new BusinessLogicException("不能删除当前登录账号")

        }

        await Promise.all([
            this.userRoleService.deleteByUserIds([params.id]),
            this.userPostService.deleteByUserIds([params.id]),
            this.loginSessionService.deleteByUserIds([params.id]),
            this.deptService.clearLeaderByUserIds([params.id])
        ])

        await this.userRepository.softDeleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除用户
     *
     * @param {BatchDeleteRequestDto} params 批量删除用户参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[batchDelete] started")

        const existingUsers = await this.userRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (existingUsers.length !== params.ids.length) {

            throw new BusinessLogicException("部分用户不存在")

        }

        const hasSystemUser = existingUsers.some(user => user.isSystem)
        if (hasSystemUser) {

            throw new BusinessLogicException("不能删除系统用户")

        }

        if (user?.id && params.ids.includes(user.id)) {

            throw new BusinessLogicException("不能删除当前登录账号")

        }

        await Promise.all([
            this.userRoleService.deleteByUserIds(params.ids),
            this.userPostService.deleteByUserIds(params.ids),
            this.loginSessionService.deleteByUserIds(params.ids),
            this.deptService.clearLeaderByUserIds(params.ids)
        ])

        await this.userRepository.softDeleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 获取激活用户列表
     *
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">[]>} 激活用户列表
     */
    public async getActiveList (): Promise<Omit<SysUser, "password" | "deletedAt">[]> {

        this.logger.info("[getActiveList] started")

        const data = await this.userRepository.findMany({
            where: { isActive: true }
        })

        this.logger.info("[getActiveList] completed")
        return data

    }

    /**
     * 根据用户ID获取用户信息
     *
     * @param {number} id 用户ID
     * @returns {Promise<Omit<SysUser, "password" | "deletedAt">>} 用户信息
     * @throws {BusinessLogicException} 用户不存在时抛出异常
     */
    public async findById (id: number): Promise<Omit<SysUser, "password" | "deletedAt">> {

        const data = await this.userRepository.findById(id, {
            include: {
                dept: {
                    select: { id: true, name: true }
                },
                userRoles: {
                    select: {
                        role: {
                            select: { id: true, name: true, code: true }
                        }
                    }
                },
                userPosts: {
                    select: {
                        post: {
                            select: { id: true, name: true, code: true }
                        }
                    }
                }
            }
        })

        if (!data) {

            throw new BusinessLogicException("用户不存在")

        }

        return data

    }

    /**
     * 根据用户名获取用户信息
     *
     * @param {string} username 用户名
     * @returns {Promise<(Omit<SysUser, "deletedAt"> & { dept: SysDept | null }) | null>} 用户信息
     */
    public async findByUsername (username: string): Promise<(Omit<SysUser, "deletedAt"> & { dept: SysDept | null }) | null> {

        const data = (await this.userRepository.findFirst({
            where: { username },
            omit: { password: false },
            include: { dept: { select: { id: true, name: true } } }
        })) as (Omit<SysUser, "deletedAt"> & { dept: SysDept | null }) | null

        return data

    }

    /**
     * 获取角色已绑定用户分页列表
     *
     * @param {object} params 查询参数
     * @param {number} params.roleId 角色ID
     * @param {string} [params.username] 用户名
     * @param {string} [params.phone] 手机号
     * @param {number} params.page 页码
     * @param {number} params.pageSize 每页数量
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>>} 用户列表和总数
     */
    public async findBoundUserPageListByRoleId (
        params: {
            roleId: number
            username?: string
            phone?: string
            page: number
            pageSize: number
        },
        user: Request["user"]
    ): Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>> {

        const { roleId, username, phone, page, pageSize } = params
        const skip = (page - 1) * pageSize
        const take = pageSize

        const allowedDeptIds = await this.resolveDeptIdsByDataScope(user?.id)

        const data = await this.userRepository.findManyByPage(skip, take, {
            where: {
                ...username && { username: { contains: username } },
                ...phone && { phone: { contains: phone } },
                ...allowedDeptIds && { deptId: { in: allowedDeptIds } },
                userRoles: { some: { roleId } }
            }
        })

        return data

    }

    /**
     * 获取角色未绑定用户分页列表
     *
     * @param {object} params 查询参数
     * @param {number} params.roleId 角色ID
     * @param {string} [params.username] 用户名
     * @param {string} [params.phone] 手机号
     * @param {number} params.page 页码
     * @param {number} params.pageSize 每页数量
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>>} 用户列表和总数
     */
    public async findUnboundUserPageListByRoleId (
        params: {
            roleId: number
            username?: string
            phone?: string
            page: number
            pageSize: number
        },
        user: Request["user"]
    ): Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>> {

        const { roleId, username, phone, page, pageSize } = params
        const skip = (page - 1) * pageSize
        const take = pageSize

        const allowedDeptIds = await this.resolveDeptIdsByDataScope(user?.id)

        const data = await this.userRepository.findManyByPage(skip, take, {
            where: {
                ...username && { username: { contains: username } },
                ...phone && { phone: { contains: phone } },
                ...allowedDeptIds && { deptId: { in: allowedDeptIds } },
                userRoles: { none: { roleId } }
            }
        })

        return data

    }

    /**
     * 注册用户
     *
     * @param {object} params 注册参数
     * @param {string} params.username 用户名
     * @param {string} params.password 密码
     * @returns {Promise<void>}
     */
    public async register (params: { username: string; password: string }): Promise<void> {

        await this.checkUsernameNotExists(params.username)

        const hashedPassword = await this.hashPassword(params.password)

        await this.userRepository.create({
            username: params.username,
            password: hashedPassword
        })

    }

    /**
     * 更新个人信息
     *
     * @param {object} params 参数
     * @param {string} [params.nickname] 昵称
     * @param {string} [params.phone] 手机号
     * @param {string} [params.email] 邮箱
     * @param {UserGender} [params.gender] 性别
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    public async updateInfo (
        params: { nickname?: string; phone?: string; email?: string; gender?: UserGender },
        user: Request["user"]
    ): Promise<void> {

        if (!user) {

            throw new BusinessLogicException("用户未登录")

        }

        const existingUser = await this.checkUserExists(user.id)

        if (params.email && params.email !== existingUser.email) {

            await this.checkEmailNotExists(params.email)

        }

        if (params.phone && params.phone !== existingUser.phone) {

            await this.checkPhoneNotExists(params.phone)

        }

        await this.userRepository.updateById(user.id, {
            ...params,
            updatedBy: user?.username
        })

    }

    /**
     * 更新用户密码
     *
     * @param {object} params 参数
     * @param {string} params.oldPassword 旧密码
     * @param {string} params.newPassword 新密码
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    public async updatePassword (params: { oldPassword: string; newPassword: string }, user: Request["user"]): Promise<void> {

        if (!user) {

            throw new BusinessLogicException("用户未登录")

        }

        if (params.oldPassword === params.newPassword) {

            throw new BusinessLogicException("新密码不能与旧密码相同")

        }

        const existingUser = await this.checkUserExists(user.id)

        const isPasswordValid = await this.validatePassword(params.oldPassword, existingUser.password)
        if (!isPasswordValid) {

            throw new BusinessLogicException("旧密码不正确")

        }

        const hashedPassword = await this.hashPassword(params.newPassword)

        await this.userRepository.updateById(user.id, {
            password: hashedPassword,
            passwordUpdatedAt: new Date(),
            updatedBy: user?.username
        })

    }

    /**
     * 更新用户头像
     *
     * @param {object} params 参数
     * @param {string} params.avatar 头像路径
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    public async updateAvatar (params: { avatar: string }, user: Request["user"]): Promise<void> {

        if (!user) {

            throw new BusinessLogicException("用户未登录")

        }

        await this.checkUserExists(user.id)

        await this.userRepository.updateById(user.id, {
            avatar: params.avatar,
            updatedBy: user?.username
        })

    }

    /**
     * 根据ID数组校验用户是否全部存在且激活
     *
     * @param {number[]} ids 用户ID数组
     * @returns {Promise<boolean>} 是否全部存在且激活
     */
    public async existsActiveByIds (ids: number[]): Promise<boolean> {

        const count = await this.userRepository.count({ where: { id: { in: ids }, isActive: true } })
        return count === ids.length

    }

    /**
     * 根据部门ID校验该部门下是否存在用户
     *
     * @param {number} deptId 部门ID
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsByDeptId (deptId: number): Promise<boolean> {

        const exists = await this.userRepository.exists({ deptId })
        return exists

    }

    /**
     * 根据ID数组校验是否存在系统用户
     *
     * @param {number[]} ids 用户ID数组
     * @returns {Promise<boolean>} 是否存在系统用户
     */
    public async existsSystemByIds (ids: number[]): Promise<boolean> {

        const exists = await this.userRepository.exists({ id: { in: ids }, isSystem: true })
        return exists

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
     * 解析当前用户基于数据权限范围可访问的部门ID集合
     *
     * @param {number} [userId] 用户ID
     * @returns {Promise<number[] | null>} 可访问的部门ID集合（null 表示全部可见）
     */
    private async resolveDeptIdsByDataScope (userId?: number): Promise<number[] | null> {

        if (!userId) {

            return []

        }

        const roleIds = await this.userRoleService.findRoleIdsByUserId(userId)
        if (roleIds.length === 0) {

            return []

        }

        const roles = await this.roleService.findActiveByIds(roleIds)
        if (roles.length === 0) {

            return []

        }

        if (roles.some(r => r.dataScope === "All")) {

            return null

        }

        const currentUser = await this.userRepository.findById(userId)
        const userDeptId = currentUser?.deptId

        const deptIds = new Set<number>()

        if (userDeptId) {

            if (roles.some(r => r.dataScope === "DeptAndBelow")) {

                const ids = await this.deptService.findDeptAndBelowIds(userDeptId)
                ids.forEach(id => deptIds.add(id))

            }
            else if (roles.some(r => r.dataScope === "Dept")) {

                deptIds.add(userDeptId)

            }

        }

        const customRoleIds = roles.filter(r => r.dataScope === "Custom").map(r => r.id)
        if (customRoleIds.length > 0) {

            const ids = await this.roleDeptService.findDeptIdsByRoleIds(customRoleIds)
            ids.forEach(id => deptIds.add(id))

        }

        return [...deptIds]

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

    /**
     * 检查部门是否存在且激活
     *
     * @param {number} deptId 部门ID
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 部门不存在或被禁用时抛出异常
     */
    private async checkActiveDeptExists (deptId: number): Promise<void> {

        const exists = await this.deptService.existsActiveByIds([deptId])
        if (!exists) {

            throw new BusinessLogicException("部门不存在或已被禁用")

        }

    }

    /**
     * 检查并设置用户岗位关联
     *
     * @param {number} userId 用户ID
     * @param {number[]} [postIds] 岗位ID数组
     * @returns {Promise<void>}
     */
    private async checkAndSetPostsByUserId (userId: number, postIds?: number[]): Promise<void> {

        if (!postIds) {

            return

        }

        if (postIds.length > 0) {

            const allExists = await this.postService.existsActiveByIds(postIds)
            if (!allExists) {

                throw new BusinessLogicException("部分岗位不存在或已被禁用")

            }

        }

        await this.userPostService.setPostsByUserId(userId, postIds)

    }

    /**
     * 检查并设置用户角色关联
     *
     * @param {number} userId 用户ID
     * @param {number[]} [roleIds] 角色ID数组
     * @returns {Promise<void>}
     */
    private async checkAndSetRolesByUserId (userId: number, roleIds?: number[]): Promise<void> {

        if (!roleIds) {

            return

        }

        if (roleIds.length > 0) {

            const allExists = await this.roleService.existsActiveByIds(roleIds)
            if (!allExists) {

                throw new BusinessLogicException("部分角色不存在或已被禁用")

            }

        }

        await this.userRoleService.setRolesByUserId(userId, roleIds)

    }

}
