/*
 * @FileDesc: 应用入口文件
 */

import { NestApplication, NestFactory } from "@nestjs/core"
import { Logger } from "nestjs-pino"

import { AppModule } from "@/app.module"

import type { NestExpressApplication } from "@nestjs/platform-express"

const { PROD, VITE_GLOBAL_PREFIX, VITE_UPLOAD_DIR, VITE_UPLOAD_PREFIX, VITE_PORT } = import.meta.env

// 创建应用
export const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 缓冲日志直到 nestjs-pino 准备就绪
    bufferLogs: true
})

// 获取 nestjs-pino 日志记录器
const logger = app.get(Logger)

// 替换默认日志记录器
app.useLogger(logger)
// 刷新缓冲日志
app.flushLogs()

// 启用代理信任以获取客户端真实 IP（适用于 Nginx、Cloudflare 等反向代理场景）
app.set("trust proxy", true)

// 设置全局前缀
app.setGlobalPrefix(VITE_GLOBAL_PREFIX)

// 使用静态资源
app.useStaticAssets(VITE_UPLOAD_DIR, { prefix: VITE_UPLOAD_PREFIX })

// 启用关闭钩子
app.enableShutdownHooks()

// 生产环境
if (PROD) {

    // 监听端口
    await app.listen(VITE_PORT)
    logger.log(`🚀 Server ready at http://localhost:${VITE_PORT}/${VITE_GLOBAL_PREFIX}`, NestApplication.name)

}
