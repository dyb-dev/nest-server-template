/*
 * @FileDesc: 加解密拦截器
 */

import { Injectable, Inject, StreamableFile } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { InjectPinoLogger } from "nestjs-pino"
import { map } from "rxjs"

import { CRYPTO_KEY } from "@/decorators"
import { CryptoRequestDto, CryptoResponseDto } from "@/dtos"
import { CryptoService } from "@/modules"

import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"
import type { Observable } from "rxjs"

/** 加解密拦截器 */
@Injectable()
export class CryptoInterceptor implements NestInterceptor {

    /** 日志记录器 */
    @InjectPinoLogger(CryptoInterceptor.name)
    private readonly logger: PinoLogger

    /** 反射器 */
    @Inject(Reflector)
    private readonly reflector: Reflector

    /** 加解密服务 */
    @Inject(CryptoService)
    private readonly cryptoService: CryptoService

    public intercept (context: ExecutionContext, next: CallHandler): Observable<StreamableFile | null | void | CryptoResponseDto> {

        const isCrypto = this.reflector.getAllAndOverride<boolean>(CRYPTO_KEY, [context.getHandler(), context.getClass()])

        // 未启用加解密，直接放行
        if (!isCrypto) {

            return next.handle()

        }

        this.logger.info("Decrypt started")

        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<Request>()

        const body = request.body as CryptoRequestDto
        const { decryptedData, aesSecret } = this.cryptoService.decryptRequestData(body)
        request.body = decryptedData

        this.logger.info("Decrypt completed")

        return next.handle().pipe(
            map((data: StreamableFile | unknown) => {

                if (data instanceof StreamableFile || data === null || data === void 0) {

                    return data

                }

                this.logger.info("Encrypt started")
                const encryptedData = this.cryptoService.encryptResponseData(data, aesSecret)
                this.logger.info("Encrypt completed")

                return encryptedData

            })
        )

    }

}
