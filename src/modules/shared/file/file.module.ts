/*
 * @FileDesc: 文件模块
 */

import { Module } from "@nestjs/common"

import { FileController } from "./file.controller"

/** 文件模块 */
@Module({
    controllers: [FileController]
})
export class FileModule {}
