/*
 * @FileDesc: 日志模块
 */

import dayjs from "dayjs"
import { LoggerModule as PinoLoggerModule } from "nestjs-pino"
import { multistream } from "pino"
import pinoPretty from "pino-pretty"
import { createStream } from "rotating-file-stream"

import type { DynamicModule } from "@nestjs/common"
import type { DestinationStream } from "pino"
import type { PrettyOptions } from "pino-pretty"

/** 日志模块 */
export class LoggerModule {

    static forRoot (): DynamicModule {

        return {
            module: LoggerModule,
            global: true,
            imports: [
                PinoLoggerModule.forRoot({
                    pinoHttp: {
                        // 日志级别
                        level: "info",
                        // 是否启用自动日志
                        autoLogging: false,
                        // 格式化器
                        formatters: {
                            // name 是 Pino 保留字段，会被显示在日志括号中，转为 `零宽字符` 避免冲突
                            log: object => Object.hasOwn(object, "name") ? { ...object, "name\u200B": object.name } : object
                        },
                        // 日志输出流
                        stream: (() => {

                            const prettyOptions: PrettyOptions = {
                                // 忽略字段
                                ignore: "pid,hostname,context,req,res,name",
                                // 时间格式 - 系统时间
                                translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
                                // 消息格式
                                messageFormat: (log, messageKey, _, { colors: { magenta } }) => {

                                    /** 上下文标识 */
                                    const context = log.context ? magenta(`[${log.context}] `) : ""
                                    /** 日志消息内容 */
                                    const message = log[messageKey] ?? ""
                                    return `${context}${message}`

                                }
                            }

                            /** 日志输出流集合 */
                            const streams: DestinationStream[] = [pinoPretty(prettyOptions)]

                            // 生产环境
                            if (import.meta.env.PROD) {

                                streams.push(
                                    pinoPretty({
                                        ...prettyOptions,
                                        // 是否启用颜色文字
                                        colorize: false,
                                        // 使用 rotating-file-stream 实现日志文件轮转
                                        destination: createStream(
                                            // 文件名
                                            time => `${dayjs(time ?? void 0).format("YYYY-MM-DD")}.log`,
                                            {
                                                // 文件存放目录
                                                path: "logs",
                                                // 每天轮转一次
                                                interval: "1d",
                                                // 每天 00:00 轮转
                                                intervalBoundary: true,
                                                // 单文件达到 10MB 轮转
                                                size: "10M",
                                                // 单文件最大 50MB，超过强制轮转
                                                maxSize: "50M",
                                                // 最大文件数 30 个，超过删除最旧的日志文件
                                                maxFiles: 30,
                                                // 文件权限: rw-r--r--
                                                // - 所有者: 可读写
                                                // - 所属组: 只读
                                                // - 其他人: 只读
                                                mode: 0o644,
                                                // 轮转后立即将旧日志文件设为只读
                                                immutable: true,
                                                // 使用 gzip 压缩旧日志文件
                                                compress: "gzip"
                                            }
                                        )
                                    })
                                )

                            }

                            return multistream(streams)

                        })()
                    }
                })
            ],
            exports: [PinoLoggerModule]
        }

    }

}
