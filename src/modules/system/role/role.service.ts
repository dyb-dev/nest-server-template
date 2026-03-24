/*
 * @FileDesc: 角色服务
 */

import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"
import { DeptService } from "../dept"
import { MenuService } from "../menu"
import { RoleDeptService } from "../role-dept"
import { RoleMenuService } from "../role-menu"
import { UserService } from "../user"
import { UserRoleService } from "../user-role"

import {
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    CreateRequestDto,
    UpdateRequestDto,
    UpdateStatusRequestDto,
    UpdateDataScopeRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto,
    GetBoundUserPageListRequestDto,
    GetUnboundUserPageListRequestDto,
    BatchBindUserRequestDto,
    UnbindUserRequestDto,
    BatchUnbindUserRequestDto
} from "./role.dto"
import { RoleRepository } from "./role.repository"

import type { SysRole, SysUser, Prisma, SysRoleDataScope } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 角色服务 */
@Injectable()
export class RoleService {

    /** 日志记录器 */
    @InjectPinoLogger(RoleService.name)
    private readonly logger: PinoLogger

    /** 角色仓储 */
    @Inject(RoleRepository)
    private readonly roleRepository: RoleRepository

    /** 部门服务 */
    @Inject(forwardRef(() => DeptService))
    private readonly deptService: TWrapper<DeptService>

    /** 角色部门服务 */
    @Inject(RoleDeptService)
    private readonly roleDeptService: RoleDeptService

    /** 用户服务 */
    @Inject(forwardRef(() => UserService))
    private readonly userService: TWrapper<UserService>

    /** 用户角色服务 */
    @Inject(UserRoleService)
    private readonly userRoleService: UserRoleService

    /** 菜单服务 */
    @Inject(MenuService)
    private readonly menuService: MenuService

    /** 角色菜单服务 */
    @Inject(RoleMenuService)
    private readonly roleMenuService: RoleMenuService

    /**
     * 获取角色列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<Omit<SysRole, "deletedAt">[]>} 角色列表
     */
    public async getList (params: GetListRequestDto): Promise<Omit<SysRole, "deletedAt">[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.roleRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页角色列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<Omit<SysRole, "deletedAt">>>} 角色列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<Omit<SysRole, "deletedAt">>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.roleRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取角色详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<Omit<SysRole, "deletedAt">>} 角色详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<Omit<SysRole, "deletedAt">> {

        this.logger.info("[getDetail] started")

        const data = await this.checkRoleExists(params.id)

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建角色
     *
     * @param {CreateRequestDto} params 创建角色参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        await this.checkNameNotExists(params.name)
        await this.checkCodeNotExists(params.code)

        const { menuIds, ...restParams } = params

        const createData: Prisma.SysRoleCreateArgs["data"] = {
            ...restParams,
            createdBy: user?.username
        }

        const createdRole = await this.roleRepository.create(createData)

        await this.checkAndSetMenusByRoleId(createdRole.id, menuIds)

        this.logger.info("[create] completed")

    }

    /**
     * 更新角色
     *
     * @param {UpdateRequestDto} params 更新角色参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        const existingRole = await this.checkRoleExists(params.id)

        if (params.name !== existingRole.name) {

            await this.checkNameNotExists(params.name)

        }

        if (params.code !== existingRole.code) {

            await this.checkCodeNotExists(params.code)

        }

        const { id, menuIds, ...updateData } = params

        await this.checkAndSetMenusByRoleId(id, menuIds)

        await this.roleRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 更新角色状态
     *
     * @param {UpdateStatusRequestDto} params 更新状态参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updateStatus (params: UpdateStatusRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updateStatus] started")

        await this.checkRoleExists(params.id)

        await this.roleRepository.updateById(params.id, {
            isActive: params.isActive,
            updatedBy: user?.username
        })

        this.logger.info("[updateStatus] completed")

    }

    /**
     * 更新角色数据权限
     *
     * @param {UpdateDataScopeRequestDto} params 更新数据权限参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updateDataScope (params: UpdateDataScopeRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updateDataScope] started")

        await this.checkRoleExists(params.id)

        const { id, deptIds, ...updateData } = params

        await this.checkAndSetDeptsByRoleId(id, updateData.dataScope, deptIds)

        await this.roleRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[updateDataScope] completed")

    }

    /**
     * 删除角色
     *
     * @param {DeleteRequestDto} params 删除角色参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        await this.checkRoleExists(params.id)

        await Promise.all([
            this.roleDeptService.deleteByRoleIds([params.id]),
            this.roleMenuService.deleteByRoleIds([params.id]),
            this.userRoleService.deleteByRoleIds([params.id])
        ])

        await this.roleRepository.softDeleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除角色
     *
     * @param {BatchDeleteRequestDto} params 批量删除角色参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const roles = await this.roleRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (roles.length !== params.ids.length) {

            throw new BusinessLogicException("部分角色不存在")

        }

        await Promise.all([
            this.roleDeptService.deleteByRoleIds(params.ids),
            this.roleMenuService.deleteByRoleIds(params.ids),
            this.userRoleService.deleteByRoleIds(params.ids)
        ])

        await this.roleRepository.softDeleteMany({
            where: { id: { in: params.ids } }
        })

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 获取角色已绑定用户分页列表
     *
     * @param {GetBoundUserPageListRequestDto} params 查询参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>>} 用户列表和总数
     */
    public async getBoundUserPageList (
        params: GetBoundUserPageListRequestDto,
        user: Request["user"]
    ): Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>> {

        this.logger.info("[getBoundUserPageList] started")

        await this.checkRoleExists(params.roleId)

        const data = await this.userService.findBoundUserPageListByRoleId(params, user)

        this.logger.info("[getBoundUserPageList] completed")
        return data

    }

    /**
     * 获取角色未绑定用户分页列表
     *
     * @param {GetUnboundUserPageListRequestDto} params 查询参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>>} 用户列表和总数
     */
    public async getUnboundUserPageList (
        params: GetUnboundUserPageListRequestDto,
        user: Request["user"]
    ): Promise<PaginationResponseDto<Omit<SysUser, "password" | "deletedAt">>> {

        this.logger.info("[getUnboundUserPageList] started")

        await this.checkRoleExists(params.roleId)

        const data = await this.userService.findUnboundUserPageListByRoleId(params, user)

        this.logger.info("[getUnboundUserPageList] completed")
        return data

    }

    /**
     * 批量绑定用户
     *
     * @param {BatchBindUserRequestDto} params 批量绑定用户参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchBindUser (params: BatchBindUserRequestDto): Promise<void> {

        this.logger.info("[batchBindUser] started")

        await this.checkRoleExists(params.roleId)

        const allExists = await this.userService.existsByIds(params.userIds)
        if (!allExists) {

            throw new BusinessLogicException("部分用户不存在")

        }

        const boundUserIds = await this.userRoleService.findUserIdsByRoleId(params.roleId, params.userIds)
        if (boundUserIds.length > 0) {

            throw new BusinessLogicException("部分用户已绑定此角色")

        }

        await this.userRoleService.createUsersByRoleId(params.roleId, params.userIds)

        this.logger.info("[batchBindUser] completed")

    }

    /**
     * 解绑用户
     *
     * @param {UnbindUserRequestDto} params 解绑用户参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async unbindUser (params: UnbindUserRequestDto): Promise<void> {

        this.logger.info("[unbindUser] started")

        await this.checkRoleExists(params.roleId)

        const bound = await this.userRoleService.existsByRoleIdAndUserId(params.roleId, params.userId)
        if (!bound) {

            throw new BusinessLogicException("该用户未绑定此角色")

        }

        await this.userRoleService.deleteUsersByRoleId(params.roleId, [params.userId])

        this.logger.info("[unbindUser] completed")

    }

    /**
     * 批量解绑用户
     *
     * @param {BatchUnbindUserRequestDto} params 批量解绑用户参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchUnbindUser (params: BatchUnbindUserRequestDto): Promise<void> {

        this.logger.info("[batchUnbindUser] started")

        await this.checkRoleExists(params.roleId)

        const boundUserIds = await this.userRoleService.findUserIdsByRoleId(params.roleId, params.userIds)
        if (boundUserIds.length !== params.userIds.length) {

            throw new BusinessLogicException("部分用户未绑定此角色")

        }

        await this.userRoleService.deleteUsersByRoleId(params.roleId, params.userIds)

        this.logger.info("[batchUnbindUser] completed")

    }

    /**
     * 根据角色ID数组查询角色列表
     *
     * @param {number[]} ids 角色ID数组
     * @returns {Promise<Omit<SysRole, "deletedAt">[]>} 角色列表
     */
    public async findByIds (ids: number[]): Promise<Omit<SysRole, "deletedAt">[]> {

        this.logger.info("[findByIds] started")
        const data = await this.roleRepository.findMany({ where: { id: { in: ids } } })
        this.logger.info("[findByIds] completed")
        return data

    }

    /**
     * 根据ID数组校验角色是否全部存在
     *
     * @param {number[]} ids 角色ID数组
     * @returns {Promise<boolean>} 是否全部存在
     */
    public async existsByIds (ids: number[]): Promise<boolean> {

        this.logger.info("[existsByIds] started")
        const count = await this.roleRepository.count({ where: { id: { in: ids } } })
        this.logger.info("[existsByIds] completed")
        return count === ids.length

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Omit<Prisma.SysRoleWhereInput, "deletedAt">} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Omit<Prisma.SysRoleWhereInput, "deletedAt"> {

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
     * 检查角色是否存在
     *
     * @param {number} id 角色ID
     * @returns {Promise<Omit<SysRole, "deletedAt">>} 角色信息
     * @throws {BusinessLogicException} 角色不存在时抛出异常
     */
    private async checkRoleExists (id: number): Promise<Omit<SysRole, "deletedAt">> {

        const role = await this.roleRepository.findById(id)
        if (!role) {

            throw new BusinessLogicException("角色不存在")

        }
        return role

    }

    /**
     * 检查角色名称是否不存在
     *
     * @param {string} name 角色名称
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 角色名称已存在时抛出异常
     */
    private async checkNameNotExists (name: string): Promise<void> {

        const exists = await this.roleRepository.exists({ name })
        if (exists) {

            throw new BusinessLogicException("角色名称已存在")

        }

    }

    /**
     * 检查角色代码是否不存在
     *
     * @param {string} code 角色代码
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 角色代码已存在时抛出异常
     */
    private async checkCodeNotExists (code: string): Promise<void> {

        const exists = await this.roleRepository.exists({ code })
        if (exists) {

            throw new BusinessLogicException("角色代码已存在")

        }

    }

    /**
     * 检查并设置角色部门关联
     *
     * @param {number} roleId 角色ID
     * @param {SysRoleDataScope} dataScope 数据范围
     * @param {number[]} [deptIds] 部门ID数组
     * @returns {Promise<void>}
     */
    private async checkAndSetDeptsByRoleId (roleId: number, dataScope: SysRoleDataScope, deptIds?: number[]): Promise<void> {

        if (dataScope !== "Custom") {

            await this.roleDeptService.setDeptsByRoleId(roleId, [])
            return

        }

        if (!deptIds) {

            return

        }

        if (deptIds.length > 0) {

            const allExists = await this.deptService.existsByIds(deptIds)
            if (!allExists) {

                throw new BusinessLogicException("部分部门不存在")

            }

        }

        await this.roleDeptService.setDeptsByRoleId(roleId, deptIds)

    }

    /**
     * 检查并设置角色菜单关联
     *
     * @param {number} roleId 角色ID
     * @param {number[]} [menuIds] 菜单ID数组
     * @returns {Promise<void>}
     */
    private async checkAndSetMenusByRoleId (roleId: number, menuIds?: number[]): Promise<void> {

        if (!menuIds) {

            return

        }

        if (menuIds.length > 0) {

            const allExists = await this.menuService.existsByIds(menuIds)
            if (!allExists) {

                throw new BusinessLogicException("部分菜单不存在")

            }

        }

        await this.roleMenuService.setMenusByRoleId(roleId, menuIds)

    }

}
