/*
 * @FileDesc: 访问令牌异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** 访问令牌异常 */
export class AccessTokenException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.AccessTokenInvalid]) {

        super(message, EResponseCode.AccessTokenInvalid)

    }

}
