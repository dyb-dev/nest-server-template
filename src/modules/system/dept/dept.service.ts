/*
 * @FileDesc: 部门服务
 */

import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"
import { RoleDeptService } from "../role-dept"
import { UserService } from "../user"

import {
    GetListRequestDto,
    GetTreeRequestDto,
    GetDetailRequestDto,
    CreateRequestDto,
    UpdateRequestDto,
    DeleteRequestDto
} from "./dept.dto"
import { DeptRepository } from "./dept.repository"

import type { SysDept, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 部门服务 */
@Injectable()
export class DeptService {

    /** 日志记录器 */
    @InjectPinoLogger(DeptService.name)
    private readonly logger: PinoLogger

    /** 部门仓储 */
    @Inject(DeptRepository)
    private readonly deptRepository: DeptRepository

    /** 用户服务 */
    @Inject(forwardRef(() => UserService))
    private readonly userService: TWrapper<UserService>

    /** 角色部门服务 */
    @Inject(RoleDeptService)
    private readonly roleDeptService: RoleDeptService

    /**
     * 获取部门列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<Omit<SysDept, "deletedAt">[]>} 部门列表
     */
    public async getList (params: GetListRequestDto): Promise<Omit<SysDept, "deletedAt">[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.deptRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取部门树
     *
     * @param {GetTreeRequestDto} params 查询参数
     * @returns {Promise<(Omit<SysDept, "deletedAt"> & { children: Omit<SysDept, "deletedAt">[] })[]>} 部门树
     */
    public async getTree (
        params: GetTreeRequestDto
    ): Promise<(Omit<SysDept, "deletedAt"> & { children: Omit<SysDept, "deletedAt">[] })[]> {

        this.logger.info("[getTree] started")

        const where = this.buildQueryWhere(params)
        const data = await this.deptRepository.findMany({ where })

        const tree = this.buildTree(data)

        this.logger.info("[getTree] completed")
        return tree

    }

    /**
     * 获取部门详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<Omit<SysDept, "deletedAt">>} 部门详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<Omit<SysDept, "deletedAt">> {

        this.logger.info("[getDetail] started")

        const data = await this.deptRepository.findById(params.id, {
            include: {
                leader: {
                    select: { id: true, username: true }
                }
            }
        })

        if (!data) {

            throw new BusinessLogicException("部门不存在")

        }

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建部门
     *
     * @param {CreateRequestDto} params 创建部门参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        const parentId = params.parentId ?? null

        const ancestors = await this.resolveAncestors(parentId)

        await this.checkDeptNameNotExists(parentId, params.name)

        if (params.leaderId) {

            await this.checkLeaderExists(params.leaderId)

        }

        const createData: Prisma.SysDeptCreateArgs["data"] = {
            ...params,
            parentId,
            ancestors,
            createdBy: user?.username
        }

        await this.deptRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 更新部门
     *
     * @param {UpdateRequestDto} params 更新部门参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        const existingDept = await this.checkDeptExists(params.id)

        let ancestors = existingDept.ancestors

        const parentId = params.parentId ?? null
        const parentIdChanged = parentId !== existingDept.parentId
        const nameChanged = params.name !== existingDept.name

        if (parentIdChanged) {

            if (parentId !== null) {

                if (parentId === params.id) {

                    throw new BusinessLogicException("不能将自身设置为父级部门")

                }

                await this.checkNotDescendant(params.id, parentId)

            }

            ancestors = await this.resolveAncestors(parentId)

        }

        if (parentIdChanged || nameChanged) {

            await this.checkDeptNameNotExists(parentId, params.name)

        }

        if (params.leaderId && params.leaderId !== existingDept.leaderId) {

            await this.checkLeaderExists(params.leaderId)

        }

        const { id, ...updateData } = params

        await this.deptRepository.updateById(id, {
            ...updateData,
            parentId,
            ancestors,
            updatedBy: user?.username
        })

        if (parentIdChanged) {

            await this.cascadeUpdateAncestors(params.id, existingDept.ancestors, ancestors)

        }

        this.logger.info("[update] completed")

    }

    /**
     * 删除部门
     *
     * @param {DeleteRequestDto} params 删除部门参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        await this.checkDeptExists(params.id)

        const hasChildren = await this.deptRepository.exists({ parentId: params.id })
        if (hasChildren) {

            throw new BusinessLogicException("存在子部门，不能删除")

        }

        const hasUsers = await this.userService.existsByDeptId(params.id)
        if (hasUsers) {

            throw new BusinessLogicException("部门下存在用户，不能删除")

        }

        const hasRoleBound = await this.roleDeptService.existsByDeptId(params.id)
        if (hasRoleBound) {

            throw new BusinessLogicException("存在角色绑定了该部门，请先解除绑定")

        }

        await this.deptRepository.softDeleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 根据部门ID查询该部门及所有子孙部门的ID数组
     *
     * @param {number} deptId 部门ID
     * @returns {Promise<number[]>} 部门ID数组
     */
    public async findDeptAndBelowIds (deptId: number): Promise<number[]> {

        const depts = await this.deptRepository.findMany({
            where: {
                OR: [{ id: deptId }, { ancestors: { contains: String(deptId) } }]
            }
        })

        return depts.map(d => d.id)

    }

    /**
     * 根据用户ID数组将部门负责人置空
     *
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async clearLeaderByUserIds (userIds: number[]): Promise<void> {

        await this.deptRepository.updateMany({ leaderId: null }, { where: { leaderId: { in: userIds } } })

    }

    /**
     * 根据ID数组校验部门是否全部存在
     *
     * @param {number[]} ids 部门ID数组
     * @returns {Promise<boolean>} 是否全部存在
     */
    public async existsByIds (ids: number[]): Promise<boolean> {

        const count = await this.deptRepository.count({ where: { id: { in: ids } } })
        return count === ids.length

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Omit<Prisma.SysDeptWhereInput, "deletedAt">} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Omit<Prisma.SysDeptWhereInput, "deletedAt"> {

        const { name, isActive } = params

        return {
            ...name && { name: { contains: name } },
            ...isActive !== void 0 && { isActive }
        }

    }

    /**
     * 将部门列表构建为树结构
     *
     * @param {Omit<SysDept, "deletedAt">[]} depts 部门列表
     * @param {number | null} parentId 父级部门ID
     * @returns {(Omit<SysDept, "deletedAt"> & { children: Omit<SysDept, "deletedAt">[] })[]} 部门树
     */
    private buildTree (
        depts: Omit<SysDept, "deletedAt">[],
        parentId: number | null = null
    ): (Omit<SysDept, "deletedAt"> & { children: Omit<SysDept, "deletedAt">[] })[] {

        return depts
            .filter(dept => dept.parentId === parentId)
            .map(dept => ({
                ...dept,
                children: this.buildTree(depts, dept.id)
            }))

    }

    /**
     * 解析祖级列表字符串
     *
     * @param {number} [parentId] 父级部门ID
     * @returns {Promise<string>} 祖级列表字符串，格式为 "1,2,3"，根节点为 ""
     */
    private async resolveAncestors (parentId: number | null): Promise<string> {

        if (parentId === null) {

            return ""

        }

        const parent = await this.deptRepository.findById(parentId)
        if (!parent) {

            throw new BusinessLogicException("父级部门不存在")

        }

        return parent.ancestors ? `${parent.ancestors},${parentId}` : `${parentId}`

    }

    /**
     * 检查同级部门名称是否不存在
     *
     * @param {number | null} [parentId] 父级部门ID
     * @param {string} name 部门名称
     * @returns {Promise<void>}
     */
    private async checkDeptNameNotExists (parentId: number | null, name: string): Promise<void> {

        const exists = await this.deptRepository.exists({
            parentId,
            name
        })

        if (exists) {

            throw new BusinessLogicException("同级部门下已存在相同名称的部门")

        }

    }

    /**
     * 检查负责人是否存在
     *
     * @param {number} leaderId 负责人用户ID
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 用户不存在时抛出异常
     */
    private async checkLeaderExists (leaderId: number): Promise<void> {

        const exists = await this.userService.existsByIds([leaderId])
        if (!exists) {

            throw new BusinessLogicException("负责人不存在")

        }

    }

    /**
     * 检查部门是否存在
     *
     * @param {number} id 部门ID
     * @returns {Promise<Omit<SysDept, "deletedAt">>} 部门信息
     * @throws {BusinessLogicException} 部门不存在时抛出异常
     */
    private async checkDeptExists (id: number): Promise<Omit<SysDept, "deletedAt">> {

        const dept = await this.deptRepository.findById(id)
        if (!dept) {

            throw new BusinessLogicException("部门不存在")

        }
        return dept

    }

    /**
     * 检查父级部门不是当前部门的子孙节点
     *
     * @param {number} id 部门ID
     * @param {number} parentId 父级部门ID
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 父级部门是子孙节点时抛出异常
     */
    private async checkNotDescendant (id: number, parentId: number): Promise<void> {

        const parent = await this.deptRepository.findById(parentId)
        if (!parent) {

            throw new BusinessLogicException("父级部门不存在")

        }

        const ancestorIds = parent.ancestors.split(",").filter(Boolean).map(Number)
        if (ancestorIds.includes(id)) {

            throw new BusinessLogicException("不能将子孙部门设置为父级部门")

        }

    }

    /**
     * 级联更新子孙部门的 ancestors 字段
     *
     * @param {number} id 部门ID
     * @param {string} oldAncestors 旧 ancestors
     * @param {string} newAncestors 新 ancestors
     * @returns {Promise<void>}
     */
    private async cascadeUpdateAncestors (id: number, oldAncestors: string, newAncestors: string): Promise<void> {

        const oldPrefix = oldAncestors ? `${oldAncestors},${id}` : `${id}`
        const newPrefix = newAncestors ? `${newAncestors},${id}` : `${id}`

        const descendants = await this.deptRepository.findMany({
            where: {
                ancestors: { startsWith: oldPrefix }
            }
        })

        if (descendants.length === 0) {

            return

        }

        await Promise.all(
            descendants.map(desc =>
                this.deptRepository.updateById(desc.id, {
                    ancestors: desc.ancestors.replace(oldPrefix, newPrefix)
                })
            )
        )

    }

}
