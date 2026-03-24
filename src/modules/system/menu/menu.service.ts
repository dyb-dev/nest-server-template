/*
 * @FileDesc: 菜单服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { BusinessLogicException } from "@/exceptions"
import { SysMenuType } from "@/prisma/client"

import { DatabaseService } from "../../core"
import { RoleMenuService } from "../role-menu"

import { GetListRequestDto, GetDetailRequestDto, CreateRequestDto, UpdateRequestDto, DeleteRequestDto } from "./menu.dto"
import { MenuRepository } from "./menu.repository"

import type { SysMenu, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 菜单服务 */
@Injectable()
export class MenuService {

    /** 日志记录器 */
    @InjectPinoLogger(MenuService.name)
    private readonly logger: PinoLogger

    /** 菜单仓储 */
    @Inject(MenuRepository)
    private readonly menuRepository: MenuRepository

    /** 角色菜单服务 */
    @Inject(RoleMenuService)
    private readonly roleMenuService: RoleMenuService

    /**
     * 获取菜单列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysMenu[]>} 菜单列表
     */
    public async getList (params: GetListRequestDto): Promise<SysMenu[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.menuRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取菜单详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<SysMenu>} 菜单详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<SysMenu> {

        this.logger.info("[getDetail] started")

        const data = await this.checkMenuExists(params.id)

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建菜单
     *
     * @param {CreateRequestDto} params 创建菜单参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        this.validateFieldsByType(params)

        if (params.parentId) {

            await this.checkMenuExists(params.parentId)

        }

        if (params.routeName) {

            await this.checkRouteNameNotExists(params.routeName)

        }

        if (params.path) {

            await this.checkPathNotExists(params.path)

        }

        if (params.perms) {

            await this.checkPermsNotExists(params.perms)

        }

        const createData: Prisma.SysMenuCreateArgs["data"] = {
            ...params,
            createdBy: user?.username
        }

        await this.menuRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 更新菜单
     *
     * @param {UpdateRequestDto} params 更新菜单参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        this.validateFieldsByType(params)

        const existingMenu = await this.checkMenuExists(params.id)

        if (params.parentId && params.parentId !== existingMenu.parentId) {

            await this.checkMenuExists(params.parentId)

        }

        if (params.routeName && params.routeName !== existingMenu.routeName) {

            await this.checkRouteNameNotExists(params.routeName)

        }

        if (params.path && params.path !== existingMenu.path) {

            await this.checkPathNotExists(params.path)

        }

        if (params.perms && params.perms !== existingMenu.perms) {

            await this.checkPermsNotExists(params.perms)

        }

        const { id, ...updateData } = params

        await this.menuRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        this.logger.info("[update] completed")

    }

    /**
     * 删除菜单
     *
     * @param {DeleteRequestDto} params 删除菜单参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        await this.checkMenuExists(params.id)

        const hasChildren = await this.menuRepository.exists({ parentId: params.id })
        if (hasChildren) {

            throw new BusinessLogicException("该菜单存在子菜单，请先删除子菜单")

        }

        await this.roleMenuService.deleteByMenuId(params.id)

        await this.menuRepository.deleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 根据ID数组校验菜单是否全部存在
     *
     * @param {number[]} ids 菜单ID数组
     * @returns {Promise<boolean>} 是否全部存在
     */
    public async existsByIds (ids: number[]): Promise<boolean> {

        this.logger.info("[existsByIds] started")
        const count = await this.menuRepository.count({ where: { id: { in: ids } } })
        this.logger.info("[existsByIds] completed")
        return count === ids.length

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysMenuWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysMenuWhereInput {

        const { name, isActive } = params

        return {
            ...name && { name: { contains: name } },
            ...isActive !== void 0 && { isActive }
        }

    }

    /**
     * 检查菜单是否存在
     *
     * @param {number} id 菜单ID
     * @returns {Promise<SysMenu>} 菜单信息
     * @throws {BusinessLogicException} 菜单不存在时抛出异常
     */
    private async checkMenuExists (id: number): Promise<SysMenu> {

        const menu = await this.menuRepository.findById(id)
        if (!menu) {

            throw new BusinessLogicException("菜单不存在")

        }
        return menu

    }

    /**
     * 检查路由名称是否不存在
     *
     * @param {string} routeName 路由名称
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 路由名称已存在时抛出异常
     */
    private async checkRouteNameNotExists (routeName: string): Promise<void> {

        const exists = await this.menuRepository.exists({ routeName })
        if (exists) {

            throw new BusinessLogicException("路由名称已存在")

        }

    }

    /**
     * 检查路径是否不存在
     *
     * @param {string} path 路径
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 路径已存在时抛出异常
     */
    private async checkPathNotExists (path: string): Promise<void> {

        const exists = await this.menuRepository.exists({ path })
        if (exists) {

            throw new BusinessLogicException("路径已存在")

        }

    }

    /**
     * 检查权限标识是否不存在
     *
     * @param {string} perms 权限标识
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 权限标识已存在时抛出异常
     */
    private async checkPermsNotExists (perms: string): Promise<void> {

        const exists = await this.menuRepository.exists({ perms })
        if (exists) {

            throw new BusinessLogicException("权限标识已存在")

        }

    }

    /**
     * 根据菜单类型校验必填字段
     *
     * @param {CreateRequestDto} params 请求参数
     * @throws {BusinessLogicException} 必填字段缺失时抛出异常
     */
    private validateFieldsByType (params: CreateRequestDto): void {

        if (params.type === SysMenuType.Catalog) {

            if (params.isExternal && !params.path) {

                throw new BusinessLogicException("菜单类型为`目录`且为外链时，路径不能为空")

            }

        }

        if (params.type === SysMenuType.Menu) {

            if (params.isExternal) {

                if (!params.path) {

                    throw new BusinessLogicException("菜单类型为`菜单`且为外链时，路径不能为空")

                }

            }
            else {

                if (!params.routeName) {

                    throw new BusinessLogicException("菜单类型为`菜单`时，路由名称不能为空")

                }

                if (!params.path) {

                    throw new BusinessLogicException("菜单类型为`菜单`时，路径不能为空")

                }

                if (!params.component) {

                    throw new BusinessLogicException("菜单类型为`菜单`时，组件路径不能为空")

                }

            }

        }

        if (params.type === SysMenuType.Button) {

            if (!params.parentId) {

                throw new BusinessLogicException("菜单类型为`按钮`时，父级菜单不能为空")

            }

            if (!params.perms) {

                throw new BusinessLogicException("菜单类型为`按钮`时，权限标识不能为空")

            }

        }

    }

}
