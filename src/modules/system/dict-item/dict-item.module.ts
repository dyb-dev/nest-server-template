/*
 * @FileDesc: 字典项模块
 */

import { forwardRef, Module } from "@nestjs/common"

import { DictTypeModule } from "../dict-type"

import { DictItemController } from "./dict-item.controller"
import { DictItemRepository } from "./dict-item.repository"
import { DictItemService } from "./dict-item.service"

/** 字典项模块 */
@Module({
    imports: [forwardRef(() => DictTypeModule)],
    controllers: [DictItemController],
    providers: [DictItemRepository, DictItemService],
    exports: [DictItemService]
})
export class DictItemModule {}
