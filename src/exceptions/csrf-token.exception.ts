/*
 * @FileDesc: CSRF 令牌异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** CSRF 令牌异常 */
export class CsrfTokenException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.CsrfTokenInvalid]) {

        super(message, EResponseCode.CsrfTokenInvalid)

    }

}
