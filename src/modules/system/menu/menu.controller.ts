/*
 * @FileDesc: 菜单控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission, User } from "@/decorators"

import {
    GetListRequestDto,
    GetDetailRequestDto,
    CreateRequestDto,
    UpdateRequestDto,
    DeleteRequestDto,
    GetTreeRequestDto
} from "./menu.dto"
import { MenuService } from "./menu.service"

import type { SysMenu } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 菜单控制器 */
@Controller("menu")
export class MenuController {

    /** 日志记录器 */
    @InjectPinoLogger(MenuController.name)
    private readonly logger: PinoLogger

    /** 菜单服务 */
    @Inject(MenuService)
    private readonly menuService: MenuService

    /**
     * 获取菜单列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<SysMenu[]>} 菜单列表
     */
    @Permission("system:menu:read")
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto, @User() user: Request["user"]): Promise<SysMenu[]> {

        this.logger.info("[getList] started")
        const data = await this.menuService.getList(query, user)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取菜单树
     *
     * @param {GetTreeRequestDto} query 查询参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<(SysMenu & { children: SysMenu[] })[]>} 菜单树
     */
    @Permission("system:menu:read")
    @Get("getTree")
    public async getTree (
        @Query() query: GetTreeRequestDto,
        @User() user: Request["user"]
    ): Promise<(SysMenu & { children: SysMenu[] })[]> {

        this.logger.info("[getTree] started")
        const data = await this.menuService.getTree(query, user)
        this.logger.info("[getTree] completed")
        return data

    }

    /**
     * 获取菜单详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<SysMenu>} 菜单详情
     */
    @Permission("system:menu:read")
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<SysMenu> {

        this.logger.info("[getDetail] started")
        const data = await this.menuService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建菜单
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:menu:create")
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.menuService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新菜单
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Permission("system:menu:update")
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.menuService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 删除菜单
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Permission("system:menu:delete")
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.menuService.delete(body)
        this.logger.info("[delete] completed")

    }

    /**
     * 获取激活菜单树
     *
     * @returns {Promise<(SysMenu & { children: SysMenu[] })[]>} 激活菜单树
     */
    @Permission("system:menu:read")
    @Get("getActiveTree")
    public async getActiveTree (): Promise<(SysMenu & { children: SysMenu[] })[]> {

        this.logger.info("[getActiveTree] started")
        const data = await this.menuService.getActiveTree()
        this.logger.info("[getActiveTree] completed")
        return data

    }

}
