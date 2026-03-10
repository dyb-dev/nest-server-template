/*
 * @FileDesc: 加解密控制器
 */

import { Controller, Get } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Public } from "@/decorators"

import { GetPublicSecretResponseDto } from "./crypto.dto"

import type { PinoLogger } from "nestjs-pino"

const { VITE_RSA_PUBLIC_SECRET } = import.meta.env

/** 加解密控制器 */
@Controller("crypto")
export class CryptoController {

    /** 日志记录器 */
    @InjectPinoLogger(CryptoController.name)
    private readonly logger: PinoLogger

    /**
     * 获取 RSA 公钥
     *
     * @returns {GetPublicSecretResponseDto} RSA 公钥响应 DTO
     */
    @Public()
    @Get("getPublicSecret")
    public getPublicSecret (): GetPublicSecretResponseDto {

        this.logger.info("[getPublicSecret] started")
        const data: GetPublicSecretResponseDto = {
            publicSecret: VITE_RSA_PUBLIC_SECRET
        }
        this.logger.info("[getPublicSecret] completed")
        return data

    }

}
