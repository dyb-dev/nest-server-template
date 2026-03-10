/*
 * @FileDesc: 加解密模块
 */

import { Module } from "@nestjs/common"

import { CryptoController } from "./crypto.controller"
import { CryptoService } from "./crypto.service"

/** 加解密模块 */
@Module({
    controllers: [CryptoController],
    providers: [CryptoService],
    exports: [CryptoService]
})
export class CryptoModule {}
