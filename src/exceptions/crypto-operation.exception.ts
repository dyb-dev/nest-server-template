/*
 * @FileDesc: 加解密操作异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** 加解密操作异常 */
export class CryptoOperationException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.CryptoOperationError]) {

        super(message, EResponseCode.CryptoOperationError)

    }

}
