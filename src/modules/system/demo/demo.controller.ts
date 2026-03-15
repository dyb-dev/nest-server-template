/*
 * @FileDesc: Demo 控制器
 */

import { join } from "node:path"

import { HttpService } from "@nestjs/axios"
import { InjectQueue } from "@nestjs/bullmq"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Controller, Post, Inject, Get, Sse, Scope, Body, StreamableFile } from "@nestjs/common"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { InjectPinoLogger } from "nestjs-pino"
import { interval, map } from "rxjs"

import { Public } from "@/decorators"

import { GetDemoListRequestDto, GetPostsResponseDto } from "./demo.dto"
import { MODULE_OPTIONS_TOKEN } from "./demo.module-definition"
import { DEMO_QUEUE } from "./demo.processor"
import { DemoService } from "./demo.service"

import type { DemoModuleOptions } from "./demo.module-definition"
import type { Cache } from "@nestjs/cache-manager"
import type {
    MessageEvent,
    OnModuleInit,
    OnApplicationShutdown,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown
} from "@nestjs/common"
import type { Queue } from "bullmq"
import type { PinoLogger } from "nestjs-pino"
import type { Observable } from "rxjs"

/** Demo 控制器 */
@Public()
@Controller({
    path: "demo",
    scope: Scope.DEFAULT
})
export class DemoController
implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {

    /** 日志记录器 */
    @InjectPinoLogger(DemoController.name)
    private readonly logger: PinoLogger

    /** demo队列 */
    @InjectQueue(DEMO_QUEUE)
    private readonly demoQueue: Queue

    /** HTTP 服务 */
    @Inject(HttpService)
    private readonly httpService: HttpService

    /** 事件触发器 */
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2

    /** 缓存管理器 */
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache

    /** demo服务 */
    @Inject(DemoService)
    private readonly demoService: DemoService

    /** 模块配置 */
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly moduleConfig: DemoModuleOptions

    /** HOOKS: 模块初始化 */
    public onModuleInit (): void {

        this.logger.info(this.moduleConfig, "onModuleInit")

    }

    /** HOOKS: 应用启动完成 */
    public onApplicationBootstrap (): void {

        this.logger.info("onApplicationBootstrap")

    }

    /** HOOKS: 模块销毁 */
    public onModuleDestroy (): void {

        this.logger.info("onModuleDestroy")

    }

    /** HOOKS: 应用关闭前 */
    public beforeApplicationShutdown (): void {

        this.logger.info("beforeApplicationShutdown")

    }

    /** HOOKS: 应用关闭时 */
    public onApplicationShutdown (): void {

        this.logger.info("onApplicationShutdown")

    }

    /**
     * 获取演示列表
     *
     * @param body 请求DTO
     *
     * @returns {Promise<string[]>} 演示列表
     */
    @Post("getDemoList")
    public async getDemoList (@Body() body: GetDemoListRequestDto): Promise<string[]> {

        this.logger.info("[getDemoList] started")

        /** 缓存键 */
        const cacheKey = join(import.meta.env.VITE_GLOBAL_PREFIX, "demo", "getDemoList")

        // 尝试从缓存获取
        let data = await this.cacheManager.get<string[]>(cacheKey)

        if (!data) {

            data = await this.demoService.getDemoList(body)
            // 存入缓存
            this.cacheManager.set(cacheKey, data)

            // 发送事件
            this.eventEmitter.emit("getDemoList", data)

            // 添加到队列后台执行
            this.demoQueue.add("getDemoList", data)

        }

        this.logger.info("[getDemoList] completed")

        return data

    }

    /**
     * 监听获取演示列表事件
     *
     * @param {string[]} params 事件参数
     */
    @OnEvent("getDemoList")
    public onGetDemoListEvent (params: string[]): void {

        this.logger.info(params, "onGetDemoListEvent")

    }

    /**
     * 获取帖子
     *
     * @returns {Promise<GetPostsResponseDto>} 获取帖子 响应 DTO
     */
    @Get("getPosts")
    public async getPosts (): Promise<GetPostsResponseDto> {

        this.logger.info("[getPosts] started")
        const { data } = await this.httpService.axiosRef.get<GetPostsResponseDto>("http://jsonplaceholder.typicode.com/posts/1")
        this.logger.info("[getPosts] completed")
        return data

    }

    /**
     * 服务器发送事件（SSE）端点
     * - 每 5 秒向客户端推送一条消息
     *
     * @returns {Observable<MessageEvent>} 消息事件流
     */
    @Sse("sse")
    public sse (): Observable<MessageEvent> {

        this.logger.info("[sse] started")
        const observable = interval(5000).pipe<MessageEvent>(map(() => ({ data: "Hello World" })))
        this.logger.info("[sse] completed")
        return observable

    }

    /**
     * 下载
     *
     * @returns {*}  {StreamableFile} 文件流
     */
    @Get("download")
    public download (): StreamableFile {

        this.logger.info("[download] started")

        /** 内容 */
        const content = `这是一个示例文件，用于测试文件下载功能 - ${new Date().toISOString()}`
        /** 生成缓冲区 */
        const buffer = Buffer.from(content, "utf-8")
        /** 文件流 */
        const streamableFile = new StreamableFile(buffer, {
            type: "text/plain; charset=utf-8",
            disposition: 'attachment; filename="demoFile.txt"'
        })

        this.logger.info("[download] completed")

        return streamableFile

    }

}
