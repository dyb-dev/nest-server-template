/*
 * @FileDesc: 刷新令牌异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** 刷新令牌异常 */
export class RefreshTokenException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.RefreshTokenInvalid]) {

        super(message, EResponseCode.RefreshTokenInvalid)

    }

}
