/*
 * @FileDesc: 通知公告模块
 */

import { Module } from "@nestjs/common"

import { NoticeController } from "./notice.controller"
import { NoticeRepository } from "./notice.repository"
import { NoticeService } from "./notice.service"

/** 通知公告模块 */
@Module({
    controllers: [NoticeController],
    providers: [NoticeRepository, NoticeService],
    exports: [NoticeService]
})
export class NoticeModule {}
