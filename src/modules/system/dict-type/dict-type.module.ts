/*
 * @FileDesc: 字典类型模块
 */

import { forwardRef, Module } from "@nestjs/common"

import { DictItemModule } from "../dict-item"

import { DictTypeController } from "./dict-type.controller"
import { DictTypeRepository } from "./dict-type.repository"
import { DictTypeService } from "./dict-type.service"

/** 字典类型模块 */
@Module({
    imports: [forwardRef(() => DictItemModule)],
    controllers: [DictTypeController],
    providers: [DictTypeRepository, DictTypeService],
    exports: [DictTypeService]
})
export class DictTypeModule {}
