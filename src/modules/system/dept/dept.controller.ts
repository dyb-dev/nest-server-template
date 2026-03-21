/*
 * @FileDesc: 部门控制器
 */

import { Controller, Get, Post, Body, Query, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { User } from "@/decorators"

import { CreateRequestDto, UpdateRequestDto, GetListRequestDto, GetDetailRequestDto, DeleteRequestDto } from "./dept.dto"
import { DeptService } from "./dept.service"

import type { SysDept } from "@/prisma/client"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 部门控制器 */
@Controller("dept")
export class DeptController {

    /** 日志记录器 */
    @InjectPinoLogger(DeptController.name)
    private readonly logger: PinoLogger

    /** 部门服务 */
    @Inject(DeptService)
    private readonly deptService: DeptService

    /**
     * 获取部门列表
     *
     * @param {GetListRequestDto} query 查询参数
     * @returns {Promise<Omit<SysDept, "deletedAt">[]>} 部门列表
     */
    @Get("getList")
    public async getList (@Query() query: GetListRequestDto): Promise<Omit<SysDept, "deletedAt">[]> {

        this.logger.info("[getList] started")
        const data = await this.deptService.getList(query)
        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取部门详情
     *
     * @param {GetDetailRequestDto} query 查询参数
     * @returns {Promise<Omit<SysDept, "deletedAt">>} 部门详情
     */
    @Get("getDetail")
    public async getDetail (@Query() query: GetDetailRequestDto): Promise<Omit<SysDept, "deletedAt">> {

        this.logger.info("[getDetail] started")
        const data = await this.deptService.getDetail(query)
        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建部门
     *
     * @param {CreateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("create")
    public async create (@Body() body: CreateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")
        await this.deptService.create(body, user)
        this.logger.info("[create] completed")

    }

    /**
     * 更新部门
     *
     * @param {UpdateRequestDto} body 请求体
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Post("update")
    public async update (@Body() body: UpdateRequestDto, @User() user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")
        await this.deptService.update(body, user)
        this.logger.info("[update] completed")

    }

    /**
     * 删除部门
     *
     * @param {DeleteRequestDto} body 请求体
     * @returns {Promise<void>}
     */
    @Post("delete")
    public async delete (@Body() body: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")
        await this.deptService.delete(body)
        this.logger.info("[delete] completed")

    }

}
