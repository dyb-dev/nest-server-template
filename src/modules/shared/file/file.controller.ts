/*
 * @FileDesc: 文件控制器
 */

import { randomBytes } from "node:crypto"
import { mkdirSync } from "node:fs"
import { extname, join } from "node:path"

import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import dayjs from "dayjs"
import { diskStorage } from "multer"
import { InjectPinoLogger } from "nestjs-pino"

import { UploadResponseDto } from "./file.dto"

import type { PinoLogger } from "nestjs-pino"

const { VITE_UPLOAD_DIR, VITE_UPLOAD_PREFIX } = import.meta.env

/** 文件控制器 */
@Controller("file")
export class FileController {

    /** 日志记录器 */
    @InjectPinoLogger(FileController.name)
    private readonly logger: PinoLogger

    /**
     * 上传
     *
     * @param file 文件
     * @returns 上传响应 DTO
     */
    @Post("upload")
    @UseInterceptors(
        FileInterceptor("file", {
            // 磁盘存储
            storage: diskStorage({
                // 存储目录
                destination: (_, __, cb) => {

                    /** 日期目录 */
                    const dateDir = dayjs().format("YYYY-MM-DD")
                    /** 完整路径 */
                    const fullPath = join(VITE_UPLOAD_DIR, dateDir)
                    // 目录不存在则创建
                    mkdirSync(fullPath, {
                        // 递归创建
                        recursive: true
                    })
                    cb(null, fullPath)

                },
                // 文件名
                filename: (_, file, cb) => {

                    /** 随机文件名 */
                    const randomName = randomBytes(16).toString("hex")
                    /** 文件扩展名 */
                    const ext = extname(file.originalname)
                    /** 文件名 */
                    const filename = `${randomName}${ext}`
                    cb(null, filename)

                }
            })
        })
    )
    public upload (@UploadedFile() file: Express.Multer.File): UploadResponseDto {

        this.logger.info("[upload] started")
        const data: UploadResponseDto = {
            path: join(VITE_UPLOAD_PREFIX, file.path.replace(VITE_UPLOAD_DIR, ""))
        }
        this.logger.info("[upload] completed")
        return data

    }

}
