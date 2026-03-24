/*
 * @FileDesc: 菜单控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { User } from "@/decorators"

import { GetListRequestDto, GetDetailRequestDto, CreateRequestDto, UpdateRequestDto, DeleteRequestDto } from "./menu.dto"
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
     * @returns {Promise<SysMenu[]>} 菜单列表
     */
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<SysMenu[]> {

        this.logger.info("[getList] started")
        const data = await this.menuService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取菜单详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<SysMenu>} 菜单详情
     */
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
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.menuService.delete(body)
        this.logger.info("[delete] completed")

    }

}
